using System;

namespace Adaptive.ReactiveTrader.Messaging
{
    public class AnonymousStreamHandler<TUpdate> : IStreamHandler<TUpdate>
    {
        private readonly Action<TUpdate> _onUpdated;
        private readonly Action<Exception> _onFailed;
        private readonly Action _onCompleted;

        public AnonymousStreamHandler(Action<TUpdate> onUpdated, Action<Exception> onFailed, Action onCompleted)
        {
            _onUpdated = onUpdated;
            _onFailed = onFailed;
            _onCompleted = onCompleted;
        }

        public void OnUpdated(TUpdate update)
        {
            _onUpdated(update);
        }

        public void OnCompleted()
        {
            _onCompleted();
        }

        public void OnError(Exception error)
        {
            _onFailed(error);
        }
    }
}