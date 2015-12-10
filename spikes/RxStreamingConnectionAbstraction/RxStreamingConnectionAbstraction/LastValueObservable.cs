using System;

namespace RxGroupBy
{
    public class LastValueObservable<TValue> : ILastValueObservable<TValue>
    {
        private readonly IObservable<TValue> _stream;

        public LastValueObservable(IObservable<TValue> stream)
        {
            _stream = stream;
        }

        public LastValueObservable(IObservable<TValue> stream, TValue latestValue)
        {
            _stream = stream;
            LatestValue = latestValue;
        }

        public TValue LatestValue { get; set; }

        public IDisposable Subscribe(IObserver<TValue> observer)
        {
            return _stream.Subscribe(observer);
        }
    }
}