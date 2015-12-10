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
        /// upon a timeout onTimeoutItemSelector is invoked to pump down the stream
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

        public static IObservable<T> RetryWithPolicy<T>(this IObservable<T> source, IRetryPolicy retryPolicy, string operationDescription)
        {
            return Observable.Create<T>(o =>
            {
                int retryCount = 0;
                var stream = source.Catch<T, Exception>(exception =>
                {
                    if(retryPolicy.ShouldRetry(exception, ++retryCount))
                    {
                        Console.WriteLine("Retrying [{0}]. This is attempt [{1}]. Exception: [{2}]", operationDescription, retryCount, exception.Message);
                        return source;
                    }
                    Console.WriteLine("Not retrying [{0}]. Retry count [{1}]. Will error. Exception: [{2}]", operationDescription, retryCount, exception.Message);
                    return Observable.Throw<T>(exception);
                });
                return stream.Subscribe(o);
            });
        }
    }
}