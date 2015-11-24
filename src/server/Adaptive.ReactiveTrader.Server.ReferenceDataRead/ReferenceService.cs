using System;
using System.Collections.Generic;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceService : IReferenceService, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceService>();
        private readonly object _gate = new object();
        private readonly IObservable<CurrencyPairUpdatesDto> _repository;

        private readonly HashSet<Action<CurrencyPairUpdatesDto>> _observers =
            new HashSet<Action<CurrencyPairUpdatesDto>>();

        public ReferenceService(IObservable<CurrencyPairUpdatesDto> repository)
        {
            _repository = repository;
        }

        public IDisposable GetCurrencyPairUpdatesStream(IRequestContext context, NothingDto request,
            IObserver<CurrencyPairUpdatesDto> streamHandler)
        {
            Log.DebugFormat("[REQ. STREAM] subscribed: ({0})", context.UserSession.Username);
            var subscription = new SingleAssignmentDisposable();

            _repository.Subscribe(streamHandler);

            lock (_gate)
            {
                _observers.Add(streamHandler.OnNext);
            }
            subscription.Disposable = Disposable.Create(() =>
            {
                lock (_gate)
                {
                    _observers.Remove(streamHandler.OnNext);
                }
            });
            return subscription;
        }

        public void Dispose()
        {
        }
    }
}