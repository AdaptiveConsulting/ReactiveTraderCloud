using System;

namespace RxGroupBy
{
    public interface ILastValueObservable<out TValue> : IObservable<TValue>
    {
        TValue LatestValue { get; }
    }
}