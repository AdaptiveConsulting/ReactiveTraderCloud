using System;

namespace Adaptive.ReactiveTrader.Messaging
{
    public static class ObservableExtensions
    {
        public static IDisposable Subscribe<T>(this IObservable<T> observable, IEndPoint<T> endPoint)
        {
            return observable.Subscribe(s => endPoint.PushMessage(s), endPoint.PushError);
        }
    }
}