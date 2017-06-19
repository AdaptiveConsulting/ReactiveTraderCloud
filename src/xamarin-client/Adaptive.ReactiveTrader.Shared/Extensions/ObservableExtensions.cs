using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Linq;
using System.Linq.Expressions;
using System.Reactive;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Threading;

namespace Adaptive.ReactiveTrader.Shared.Extensions
{
    public static class ObservableExtensions
    {
        public static IObservable<T> LazilyConnect<T>(this IConnectableObservable<T> connectable, SingleAssignmentDisposable futureDisposable)
        {
            var connected = 0;
            return Observable.Create<T>(observer =>
            {
                var subscription = connectable.Subscribe(observer);
                if (Interlocked.CompareExchange(ref connected, 1, 0) == 0)
                {
                    if (!futureDisposable.IsDisposed)
                    {
                        futureDisposable.Disposable = connectable.Connect();
                    }
                }
                return subscription;
            }).AsObservable();
        }

        public static IObservable<T> CacheFirstResult<T>(this IObservable<T> observable)
        {
            // We are happy to lose the underlying subscription here because we have .Take(1) the source stream.
            return observable.Take(1).PublishLast().LazilyConnect(new SingleAssignmentDisposable());
        }

        public static IObservable<TSource> TakeUntilInclusive<TSource>(this IObservable<TSource> source, Func<TSource, Boolean> predicate)
        {
            return Observable.Create<TSource>(
                observer => source.Subscribe(
                  item =>
                  {
                      observer.OnNext(item);
                      if (predicate(item))
                          observer.OnCompleted();
                  },
                  observer.OnError,
                  observer.OnCompleted
                )
              );
        }

        public static IObservable<T> OnSubscribe<T>(this IObservable<T> source, Action onSubscribe)
        {
            return Observable.Create<T>(observer =>
            {
                onSubscribe();
                return source.Subscribe(observer);
            });
        }

        public static IObservable<T> ObserveLatestOn<T>(this IObservable<T> source, IScheduler scheduler)
        {
            return Observable.Create<T>(observer =>
            {
                var gate = new object();
                bool active = false;
                var cancelable = new MultipleAssignmentDisposable();
                var disposable = source.Materialize().Subscribe(thisNotification =>
                {
                    bool wasNotAlreadyActive;
                    Notification<T> outsideNotification;
                    lock (gate)
                    {
                        wasNotAlreadyActive = !active;
                        active = true;
                        outsideNotification = thisNotification;
                    }

                    if (wasNotAlreadyActive)
                    {
                        cancelable.Disposable = scheduler.Schedule(self =>
                        {
                            Notification<T> localNotification;
                            lock (gate)
                            {
                                localNotification = outsideNotification;
                                outsideNotification = null;
                            }
                            localNotification.Accept(observer);
                            bool hasPendingNotification;
                            lock (gate)
                            {
                                hasPendingNotification = active = (outsideNotification != null);
                            }
                            if (hasPendingNotification)
                            {
                                self();
                            }
                        });
                    }
                });
                return new CompositeDisposable(disposable, cancelable);
            });
        }

        /// <summary>
        /// Applies a conflation algorithm to an observable stream. 
        /// Anytime the stream OnNext twice below minimumUpdatePeriod, the second update gets delayed to respect the minimumUpdatePeriod
        /// If more than 2 update happen, only the last update is pushed
        /// Updates are pushed and rescheduled using the provided scheduler
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source">stream</param>
        /// <param name="minimumUpdatePeriod">minimum delay between 2 updates</param>
        /// <param name="scheduler">to be used to publish updates and schedule delayed updates</param>
        /// <returns></returns>
        public static IObservable<T> Conflate<T>(this IObservable<T> source, TimeSpan minimumUpdatePeriod, IScheduler scheduler)
        {
            return Observable.Create<T>(observer =>
            {
                // indicate when the last update was published
                var lastUpdateTime = DateTimeOffset.MinValue;
                // indicate if an update is currently scheduled
                var updateScheduled = new MultipleAssignmentDisposable();
                // indicate if completion has been requested (we can't complete immediatly if an update is in flight)
                var completionRequested = false;
                var gate = new object();

                var subscription = source
                        .ObserveOn(scheduler)
                        .Subscribe(
                            x =>
                            {
                                var currentUpdateTime = scheduler.Now;

                                bool scheduleRequired;
                                lock (gate)
                                {
                                    scheduleRequired = currentUpdateTime - lastUpdateTime < minimumUpdatePeriod;
                                    if (scheduleRequired && updateScheduled.Disposable != null)
                                    {
                                        updateScheduled.Disposable.Dispose();
                                        updateScheduled.Disposable = null;
                                    }
                                }

                                if (scheduleRequired)
                                {
                                    updateScheduled.Disposable = scheduler.Schedule(lastUpdateTime + minimumUpdatePeriod, () =>
                                    {
                                        observer.OnNext(x);

                                        lock (gate)
                                        {
                                            lastUpdateTime = scheduler.Now;
                                            updateScheduled.Disposable = null;
                                            if (completionRequested)
                                            {
                                                observer.OnCompleted();
                                            }
                                        }
                                    });
                                }
                                else
                                {
                                    observer.OnNext(x);
                                    lock (gate)
                                    {
                                        lastUpdateTime = scheduler.Now;
                                    }
                                }
                            },
                            observer.OnError,
                            () =>
                            {
                                // if we have scheduled an update we need to complete once the update has been published
                                if (updateScheduled.Disposable != null)
                                {
                                    lock (gate)
                                    {
                                        completionRequested = true;                                        
                                    }
                                }
                                else
                                {
                                    observer.OnCompleted();
                                }
                            });

                return subscription;
            });
        }

        /// <summary>
        /// Injects heartbeats in a stream when the source stream becomes quiet:
        ///  - upon subscription if the source does not OnNext any update a heartbeat will be pushed after heartbeatPeriod, periodilcally until source receives an update
        ///  - when an update is received it is immediatly pushed. After this update, if source does not OnNext after heartbeatPeriod, heartbeats will be pushed
        /// </summary>
        /// <typeparam name="T">update type</typeparam>
        /// <param name="source">source stream</param>
        /// <param name="heartbeatPeriod"></param>
        /// <param name="scheduler"></param>
        /// <returns></returns>
        public static IObservable<IHeartbeat<T>> Heartbeat<T>(this IObservable<T> source, TimeSpan heartbeatPeriod, IScheduler scheduler)
        {
            return Observable.Create<IHeartbeat<T>>(observer =>
            {
                var heartbeatTimerSubscription = new MultipleAssignmentDisposable();
                var gate = new object();

                Action scheduleHeartbeats = () =>
                {
                    var disposable = Observable
                                .Timer(heartbeatPeriod, heartbeatPeriod, scheduler)
                                .Subscribe(
                                    _ => observer.OnNext(new Heartbeat<T>()));

                    lock (gate)
                    {
                        heartbeatTimerSubscription.Disposable = disposable;
                    }
                };

                var sourceSubscription = source.Subscribe(
                    x =>
                    {
                        lock (gate)
                        {
                            // cancel any scheduled heartbeat
                            heartbeatTimerSubscription.Disposable.Dispose();    
                        }
                        
                        observer.OnNext(new Heartbeat<T>(x));

                        scheduleHeartbeats();
                    },
                    observer.OnError,
                    observer.OnCompleted);

                scheduleHeartbeats();

                return new CompositeDisposable { sourceSubscription, heartbeatTimerSubscription };
            });
        }

        /// <summary>
        /// Detects when a stream becomes inactive for some period of time
        /// </summary>
        /// <typeparam name="T">update type</typeparam>
        /// <param name="source">source stream</param>
        /// <param name="stalenessPeriod">if source steam does not OnNext any update during this period, it is declared staled</param>
        /// <param name="scheduler"></param>
        /// <returns></returns>
        public static IObservable<IStale<T>> DetectStale<T>(this IObservable<T> source, TimeSpan stalenessPeriod, IScheduler scheduler)
        {
            return Observable.Create<IStale<T>>(observer =>
            {
                var timerSubscription = new SerialDisposable();
                var observerLock = new object();

                Action scheduleStale = () =>
                {
                    timerSubscription.Disposable = Observable
                            .Timer(stalenessPeriod, scheduler)
                            .Subscribe(_ =>
                            {
                                lock (observerLock)
                                {
                                    observer.OnNext(new Stale<T>());
                                }
                            });
                };

                var sourceSubscription = source.Subscribe(
                    x =>
                    {
                        // cancel any scheduled stale update
                        var disposable = timerSubscription.Disposable;
                        if (disposable != null)
                            disposable.Dispose();

                        lock (observerLock)
                        {
                            observer.OnNext(new Stale<T>(x));
                        }

                        scheduleStale();
                    },
                    observer.OnError,
                    observer.OnCompleted);

                scheduleStale();

                return new CompositeDisposable { sourceSubscription, timerSubscription };
            });
        }

        public static IObservable<Unit> ObserveProperty(this INotifyPropertyChanged source)
        {
            return Observable.FromEvent<PropertyChangedEventHandler, PropertyChangedEventArgs>(
                h => (s, e) => h(e),
                h => source.PropertyChanged += h,
                h => source.PropertyChanged -= h)
            .Select(_ => Unit.Default);
        }

        public static IObservable<TProp> ObserveProperty<TSource, TProp>(this TSource source,
                                                           Expression<Func<TSource, TProp>> propertyExpression,
                                                           bool observeInitialValue)
            where TSource : INotifyPropertyChanged
        {
            return Observable.Create<TProp>(o =>
                {
                    var propertyName = GetPropertyName(source, propertyExpression);
                    var selector = CompiledExpressionHelper<TSource, TProp>.GetFunc(propertyExpression);

                    var observable
                        = from evt in Observable.FromEvent<PropertyChangedEventHandler, PropertyChangedEventArgs>(
                            h => (s, e) => h(e),
                            h => source.PropertyChanged += h,
                            h => source.PropertyChanged -= h)
                          where evt.PropertyName == propertyName
                          select selector(source);
                    observable = observeInitialValue ? observable.StartWith(selector(source)) : observable;

                    return observable.Subscribe(o);
                });
        }

        public static IObservable<TProp> ObserveProperty<TSource, TProp>(this TSource source,
                                                                            Expression<Func<TSource, TProp>>
                                                                                propertyExpression)
            where TSource : INotifyPropertyChanged
        {
            return ObserveProperty(source, propertyExpression, false);
        }

        public static IObservable<NotifyCollectionChangedEventArgs> ObserveCollection(this INotifyCollectionChanged source)
        {
            var observable =
                from evt in Observable.FromEvent<NotifyCollectionChangedEventHandler, NotifyCollectionChangedEventArgs>(
                    h => (s, e) => h(e),
                    h => source.CollectionChanged += h,
                    h => source.CollectionChanged -= h)
                select evt;

            return observable;
        }

        public static string GetPropertyName<TSource, TProp>(this TSource source,
                                                             Expression<Func<TSource, TProp>> propertyExpression)
        {
            var memberExpression = CompiledExpressionHelper<TSource, TProp>.GetMemberExpression(propertyExpression);
            return memberExpression.Member.Name;
        }

        private static class CompiledExpressionHelper<TSource, TProp>
        {
            private static readonly Dictionary<string, Func<TSource, TProp>> Funcs = new Dictionary<string,Func<TSource,TProp>>();

            public static Func<TSource, TProp> GetFunc(Expression<Func<TSource, TProp>> propertyExpression)
            {
                var memberExpression = GetMemberExpression(propertyExpression);
                var propertyName = memberExpression.Member.Name;
                var key = typeof (TSource).FullName + "." + propertyName;
                Func<TSource, TProp> func;

                if (!Funcs.TryGetValue(key, out func))
                {
                    Funcs[key] = propertyExpression.Compile();
                }
                return Funcs[key];
            }

            public static MemberExpression GetMemberExpression(Expression<Func<TSource, TProp>> propertyExpression)
            {
                MemberExpression memberExpression;

                var unaryExpr = propertyExpression.Body as UnaryExpression;
                if (unaryExpr != null && unaryExpr.NodeType == ExpressionType.Convert)
                {
                    memberExpression = (MemberExpression) unaryExpr.Operand;
                }
                else
                {
                    memberExpression = (MemberExpression) propertyExpression.Body;
                }
                    if (memberExpression.Expression.NodeType != ExpressionType.Parameter && memberExpression.Expression.NodeType != ExpressionType.Constant)
                    {
                        throw new InvalidOperationException("Getting members not directly on the expression's root object has been disallowed.");
                    }
                return memberExpression;
            }
        }

        public static IDisposable OnItems<TSource>(this INotifyCollectionChanged notifyingCollection, Func<TSource, IDisposable> onNewItem)
        {
            if (notifyingCollection == null)
                throw new ArgumentNullException("notifyingCollection");

            var collection = (ICollection)notifyingCollection;
            var subscriptions = new Dictionary<TSource, IDisposable>();
            var handleNewItem = new Action<TSource>(item => subscriptions.Add(item, onNewItem(item)));
            var handleOldItem = new Action<TSource>(item =>
            {
                IDisposable subscription;
                if (subscriptions.TryGetValue(item, out subscription))
                {
                    subscriptions.Remove(item);
                    subscription.Dispose();
                }
            });
            var handleDispose = new Action(() =>
            {
                foreach (var item in subscriptions.Keys.ToArray())
                {
                    handleOldItem(item);
                }
            });

            foreach (var item in collection.OfType<TSource>())
            {
                handleNewItem(item);
            }

            var collectionObservation = notifyingCollection.ObserveCollection()
                .Subscribe(e =>
                {
                    switch (e.Action)
                    {
                        case NotifyCollectionChangedAction.Add:
                            if (e.NewItems != null)
                            {
                                foreach (var item in e.NewItems.OfType<TSource>())
                                {
                                    handleNewItem(item);
                                }
                            }

                            break;
                        case NotifyCollectionChangedAction.Remove:
                            if (e.OldItems != null)
                            {
                                foreach (var item in e.OldItems.OfType<TSource>())
                                {
                                    handleOldItem(item);
                                }
                            }
                            break;
                        case NotifyCollectionChangedAction.Replace:
                            if (e.OldItems != null)
                            {
                                foreach (var item in e.OldItems.OfType<TSource>())
                                {
                                    handleOldItem(item);
                                }
                            }
                            if (e.NewItems != null)
                            {
                                foreach (var item in e.NewItems.OfType<TSource>())
                                {
                                    handleNewItem(item);
                                }
                            }
                            break;
                        case NotifyCollectionChangedAction.Reset:
                            handleDispose();
                            if (e.NewItems != null)
                            {
                                foreach (var item in e.NewItems.OfType<TSource>())
                                {
                                    handleNewItem(item);
                                }
                            }
                            break;
                    }
                });

            return Disposable.Create(() =>
            {
                handleDispose();
                collectionObservation.Dispose();
            });
        }
    }
}
