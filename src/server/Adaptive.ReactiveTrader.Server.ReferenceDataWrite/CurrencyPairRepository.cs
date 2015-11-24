using System;
using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract.Events.Reference;
using Adaptive.ReactiveTrader.EventStore;
using EventStore.ClientAPI;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class CurrencyPairRepository : ICurrencyPairRepository
    {
        private readonly IEventStore _eventStoreConnection;

        public CurrencyPairRepository(IEventStore eventStoreConnection)
        {
            _eventStoreConnection = eventStoreConnection;
        }

        public Task Create(string symbol, int pipsPosition, int ratePrecision, decimal sampleRate, string comment = null)
        {
            var createEvent = new CurrencyPairCreatedEvent(symbol, pipsPosition, ratePrecision, sampleRate, comment);
            var eventData = new EventData(Guid.NewGuid(), createEvent.Name, false,
                Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(createEvent)), new byte[0]);
            return _eventStoreConnection.AppendToStreamAsync($"ccyPair-{symbol}", ExpectedVersion.NoStream, eventData);
        }

        public Task Activate(string symbol)
        {
            var activateEvent = new CurrencyPairActivatedEvent(symbol);
            var eventData = new EventData(Guid.NewGuid(), activateEvent.Name, false,
                Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(activateEvent)), new byte[0]);
            return _eventStoreConnection.AppendToStreamAsync($"ccyPair-{symbol}", ExpectedVersion.Any, eventData);
        }

        public Task Deactivate(string symbol)
        {
            var deactivateEvent = new CurrencyPairDeactivatedEvent(symbol);
            var eventData = new EventData(Guid.NewGuid(), deactivateEvent.Name, false,
                Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(deactivateEvent)), new byte[0]);
            return _eventStoreConnection.AppendToStreamAsync($"ccyPair-{symbol}", ExpectedVersion.Any, eventData);
        }
    }
}