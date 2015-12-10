using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;

namespace RxStreamingConnectionAbstraction
{
    public static class ServiceObservableExt
    {
        /// <summary>
        /// Adds timeout semantics to inner Observables of an Observable of Observables stream
        /// Upon a timeout onTimeoutItemSelector is invoked to pump down the stream
        /// </summary>
        public static IObservable<IObservable<TValue>> TimeoutInnerObservables<TKey, TValue>(this IObservable<IGroupedObservable<TKey, TValue>> sources, TimeSpan period, Func<TKey, TValue> onTimeoutItemSelector, IScheduler scheduler)
        {
            return Observable.Create<IObservable<TValue>>(o =>
            {
                return sources.Select(innerSource =>
                {
                    TKey key = innerSource.Key;
                    return innerSource
                        .Timeout(period, Observable.Return(onTimeoutItemSelector(key)), scheduler)
                        .Repeat();
                }).Subscribe(o);
            });
        }

        /// <summary>
        /// Converts an Observable of Observables into an Observable of IDictionary<TKey, ILastValueObservable<TValue>> whereby ILastValueObservable items are hot observable streams exposing their last values 
        /// </summary>
        public static IObservable<IDictionary<TKey, ILastValueObservable<TValue>>> ToLastValueObservableDictionary<TKey, TValue>(this IObservable<IObservable<TValue>> source, Func<TValue, TKey> keySelector)
        {
            return Observable.Create<IDictionary<TKey, ILastValueObservable<TValue>>>(o =>
            {
                object cacheLock = new object();
                Dictionary<TKey, LastValueObservable<TValue>> cache = new Dictionary<TKey, LastValueObservable<TValue>>();
                CompositeDisposable disposables = new CompositeDisposable();
                disposables.Add(
                    source.Subscribe(innerSource =>
                        {
                            IObservable<TValue> innerSourcePublished = innerSource.Replay(1).RefCount();
                            disposables.Add(
                                innerSourcePublished.Subscribe(i =>
                                {
                                    TKey key = keySelector(i);
                                    IDictionary<TKey, ILastValueObservable<TValue>> cacheCopy;
                                    lock (cacheLock)
                                    {
                                        if (!cache.ContainsKey(key))
                                        {
                                            cache[key] = new LastValueObservable<TValue>(innerSourcePublished, i);
                                        }
                                        else
                                        {
                                            cache[key].LatestValue = i;
                                        }
                                        cacheCopy = cache.ToDictionary(c => c.Key, c => (ILastValueObservable<TValue>) new LastValueObservable<TValue>(c.Value, c.Value.LatestValue));
                                    }
                                    o.OnNext(cacheCopy);
                                })
                            );
                        },
                        o.OnError,
                        o.OnCompleted)
                    );
                return disposables;
            });
        }

        /// <summary>
        /// Gets the Observable status stream for the service currently having the minimum load
        /// </summary>
        public static IObservable<ILastValueObservable<ServiceStatus>> GetServiceWithMinLoad<TKey>(this IObservable<IDictionary<TKey, ILastValueObservable<ServiceStatus>>> source)
        {
            return Observable.Create<ILastValueObservable<ServiceStatus>>(o =>
            {
                CompositeDisposable disposables = new CompositeDisposable();
                disposables.Add(
                    source.Subscribe(dictionary =>
                    {
                        ILastValueObservable<ServiceStatus> serviceWithLeastLoad = dictionary.Values
                            .OrderBy(observable=> observable.LatestValue.Load)
                            .FirstOrDefault(s => s.LatestValue.IsConnected);
                        if (serviceWithLeastLoad != null)
                        {
                            o.OnNext(serviceWithLeastLoad);
                        }
                    },
                    o.OnError,
                    o.OnCompleted)
                );
                return disposables;
            });
        }

        /// <summary>
        /// Adds retry behaviour to observable streams
        /// </summary>
        public static IObservable<T> RetryWithPolicy<T>(this IObservable<T> source, IRetryPolicy retryPolicy, string operationDescription)
        {
            return Observable.Create<T>(o =>
            {
                int retryCount = 0;
                Action subscribe = null;
                SerialDisposable disposable = new SerialDisposable();
                subscribe = () =>
                {
                    disposable.Disposable = source.Subscribe(
                        o.OnNext,
                        ex => {
                            if (retryPolicy.ShouldRetry(ex, ++retryCount))
                            {
                                Console.WriteLine("Retrying [{0}]. This is attempt [{1}]. Exception: [{2}]", operationDescription, retryCount, ex.Message);
                                subscribe();
                            }
                            else
                            {
                                Console.WriteLine("Not retrying [{0}]. Retry count [{1}]. Will error. Exception: [{2}]", operationDescription, retryCount, ex.Message);
                                o.OnError(ex);
                            }
                        },
                        o.OnCompleted
                    );
                };
                subscribe();
                return disposable;
            });
        }

        /// <summary>
        /// Exactly like the out-of-the-box TakeUntil but upon terminationSequence yielding it will first pump a final value IF the stream previously procured one, useful when you need to pump a value using some state from the stream
        /// </summary>
        public static IObservable<T> TakeUntilEndWith<T, TOther>(this IObservable<T> source, IObservable<TOther> terminationSequence, Func<T, T> endWithItemFactory)
        {
            return Observable.Create<T>(o =>
            {
                CompositeDisposable disposables = new CompositeDisposable();
                bool lastItemSet = false;
                T lastItem = default(T);
                disposables.Add(
                    terminationSequence.Take(1).Subscribe(
                        _ => {
                            if(lastItemSet) o.OnNext(endWithItemFactory(lastItem));
                            o.OnCompleted();
                        }, 
                        o.OnError, 
                        o.OnCompleted
                    )
                );
                disposables.Add(
                    source.Subscribe(
                        i => {
                            lastItem = i;
                            lastItemSet = true;
                            o.OnNext(i);
                        }
                        , o.OnError, 
                        o.OnCompleted
                    )
                );
                return disposables;
            });
        }


    }
}