using System;

namespace RxStreamingConnectionAbstraction
{
    public interface ILastValueObservable<out TValue> : IObservable<TValue>
    {
        TValue LatestValue { get; }
    }
}