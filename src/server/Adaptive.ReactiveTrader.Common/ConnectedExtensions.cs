using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;

namespace Adaptive.ReactiveTrader.Common
{
    public static class ConnectedExtensions
    {
        public static IConnected<TResult> Select<TSource, TResult>(this IConnected<TSource> source,
                                                                   Func<TSource, TResult> selector)
        {
            if (source.IsConnected)
                return new Connected<TResult>(selector(source.Value));

            return new Connected<TResult>();
        }

        public static IObservable<IConnected<TResult>> LaunchOrKill<TSource, TResult>(
            this IObservable<IConnected<TSource>> source,
            Func<TSource, TResult> selector) where TResult : IDisposable
        {
            return source.Select(s => GetInstanceStream(() => Select(s, selector)))
                         .Switch();
        }

        private static IObservable<IConnected<T>> GetInstanceStream<T>(Func<IConnected<T>> factory)
            where T : IDisposable
        {
            return Observable.Create<IConnected<T>>(obs =>
            {
                var instance = factory();
                obs.OnNext(instance);
                return instance.IsConnected ? Disposable.Create(() => instance.Value.Dispose()) : Disposable.Empty;
            });
        }

        public static IObservable<IConnected<TResult>> LaunchOrKill<TSource, TSource2, TResult>(
            this IObservable<IConnected<TSource>> first,
            IObservable<IConnected<TSource2>> second,
            Func<TSource, TSource2, TResult> selector) where TResult : IDisposable
        {
            return first.CombineLatest(second,
                (a, b) =>
                    GetInstanceStream(() =>
                        a.IsConnected && b.IsConnected
                            ? new Connected<TResult>(selector(a.Value, b.Value))
                            : new Connected<TResult>()))
                .Switch();
        }
    }
}