using System;

namespace Adaptive.ReactiveTrader.Client.Domain.Transport.Wamp
{
    public interface ILastValueObservable<out TValue>
    {
        TValue LatestValue { get; }
        IObservable<TValue> Stream { get; }
    }

    public class LastValueObservable<TValue> : ILastValueObservable<TValue>
    {
        public LastValueObservable(IObservable<TValue> stream, TValue latestValue)
        {
            Stream = stream;
            LatestValue = latestValue;
        }

        public TValue LatestValue { get; set; }
        public IObservable<TValue> Stream { get; }
    }
}