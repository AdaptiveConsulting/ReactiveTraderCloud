using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public class ReferenceService : IReferenceService, IDisposable
    {
        private readonly ICurrencyPairRepository _repository;
        private readonly IRepository _rep;
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceService>();
        private readonly object _gate = new object();

        private readonly HashSet<Action<CurrencyPairUpdatesDto>> _observers =
            new HashSet<Action<CurrencyPairUpdatesDto>>();

        public ReferenceService(ICurrencyPairRepository repository, IRepository rep )
        {
            _repository = repository;
            _rep = rep;
        }

        public IDisposable GetCurrencyPairUpdatesStream(IRequestContext context, NothingDto request,
            IObserver<CurrencyPairUpdatesDto> streamHandler)
        {
            Log.DebugFormat("[REQ. STREAM] subscribed: ({0})", context.UserSession.Username);
            var subscription = new SingleAssignmentDisposable();
            
            streamHandler.OnNext(new CurrencyPairUpdatesDto
            {
                Updates = _repository.GetAllCurrencyPairs().Select(
                    c => new CurrencyPairUpdateDto
                    {
                        UpdateType = UpdateTypeDto.Added,
                        CurrencyPair = c.CurrencyPair,
                    })
            });

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

        public void Publish(CurrencyPairUpdateDto update)
        {
            List<Action<CurrencyPairUpdatesDto>> sub;

            lock (_gate)
            {
                if (!_observers.Any()) return;
                sub = _observers.ToList();
            }

            foreach (var s in sub)
            {
                s(new CurrencyPairUpdatesDto
                {
                    Updates = new[] {update},
                });
            }
        }

        public void Dispose()
        {
        }
    }
}