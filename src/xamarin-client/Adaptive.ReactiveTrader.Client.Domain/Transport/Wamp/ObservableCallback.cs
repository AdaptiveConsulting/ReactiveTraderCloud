using Adaptive.ReactiveTrader.Shared.Logging;
using System;

namespace Adaptive.ReactiveTrader.Client.Domain.Transport.Wamp
{
    internal class ObservableCallback<T> : WampCallback<T>, IDisposable
    {
        private readonly IObserver<T> _observer;
        private bool _isDisposed;

        public ObservableCallback(string procedureName, IObserver<T> observer, ILoggerFactory loggerFactory) : base(procedureName, loggerFactory)
        {
            _observer = observer;
        }

        protected override void OnResult(T result)
        {
            if (_isDisposed)
            {
                return;
            }
            _observer.OnNext(result);
            _observer.OnCompleted();
        }

        protected override void OnError(Exception ex)
        {
            if (_isDisposed)
            {
                return;
            }

            _observer.OnError(ex);
        }

        public void Dispose()
        {
            _isDisposed = true;
        }
    }
}