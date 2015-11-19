using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public interface IReferenceService
    {
        IDisposable GetCurrencyPairUpdatesStream(RequestContext context, NothingDto request,
            IObserver<CurrencyPairUpdatesDto> streamHandler);
    }

    public class NothingDto
    {
        public string Test { get; set; }
    }

    public class CurrencyPairUpdatesDto
    {
        public IEnumerable<CurrencyPairUpdateDto> Updates { get; set; }
    }


    public class ReferenceServiceHost
    {
        private readonly IReferenceService _referenceService;
        private readonly IBroker _broker;

        public ReferenceServiceHost(IReferenceService referenceService, IBroker broker)
        {
            _referenceService = referenceService;
            _broker = broker;
        }

        public void GetCurrencyPairUpdatesStream(Message message)
        {
            var payload = JsonConvert.DeserializeObject<NothingDto>(message.Payload.ToString());

            var requestContext = new RequestContext
            {
                RequestMessage = message,
                UserSession = new UserSession
                {
                    Username = "Unknown"
                }
            };

            var replyTo = message.ReplyTo;

            var responseChannel = _broker.CreateChannelAsync<CurrencyPairUpdatesDto>(replyTo).Result;
            // todo maintain list of clients
            _referenceService.GetCurrencyPairUpdatesStream(requestContext, payload, responseChannel);
        }

        public void Start()
        {
            _broker.RegisterCall("reference.getCurrencyPairUpdatesStream", GetCurrencyPairUpdatesStream);
        }
    }

    public class UserSession
    {
        public string Username { get; set; }
    }

    public class RequestContext
    {
        public Message RequestMessage { get; set; }
        public UserSession UserSession { get; set; }
    }


    public interface Repository
    {
        IObservable<CurrencyPairUpdatesDto> GetCurrencyUpdateStream();
    }
    
    public class ReferenceService : IReferenceService, IDisposable
    {
        private readonly ICurrencyPairRepository _repository;
        private readonly Repository _rep;
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceService>();
        private readonly object _gate = new object();

        private readonly HashSet<Action<CurrencyPairUpdatesDto>> _observers =
            new HashSet<Action<CurrencyPairUpdatesDto>>();

        public ReferenceService(ICurrencyPairRepository repository, Repository rep )
        {
            _repository = repository;
            _rep = rep;
        }

        public IDisposable GetCurrencyPairUpdatesStream(RequestContext context, NothingDto request,
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