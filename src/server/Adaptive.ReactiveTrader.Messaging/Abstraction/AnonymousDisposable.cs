using System;
using System.Diagnostics;
using System.Threading;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class AnonymousDisposable : IDisposable
    {
        private Action _dispose;

        public AnonymousDisposable(Action dispose)
        {
            Debug.Assert(dispose != null);
            _dispose = dispose;
        }

        public void Dispose()
        {
            var dispose = Interlocked.Exchange(ref _dispose, null);
            dispose?.Invoke();
        }
    }
}