using System;

namespace Adaptive.ReactiveTrader.Shared.Extensions
{
    class Stale<T> : IStale<T>
    {
        private readonly T _update;

        public Stale() : this(true, default(T))
        {
        }

        public Stale(T update) : this(false, update)
        {
        }

        private Stale(bool isStale, T update)
        {
            IsStale = isStale;
            _update = update;
        }

        public bool IsStale { get; private set; }

        public T Update
        {
            get
            {
                if (IsStale)
                    throw new InvalidOperationException("Stale instance has no update.");
                return _update;
            }
        }
    }
}