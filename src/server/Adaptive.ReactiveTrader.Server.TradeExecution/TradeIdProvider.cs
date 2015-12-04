using System;
using EventStore.ClientAPI;
using System.Threading;
using System.Threading.Tasks;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class TradeIdProvider : IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<TradeIdProvider>();

        private readonly Task _gotLatestEvent;
        private long _tradeId;

        public TradeIdProvider(IEventStoreConnection eventStore)
        {
            var tcs = new TaskCompletionSource<object>();
            _gotLatestEvent = tcs.Task;

            eventStore.SubscribeToAllFrom(Position.Start,
                false,
                (_, resolvedEvent) =>
                {
                    if (!tcs.Task.IsCompleted && resolvedEvent.Event.EventType == "TradeCreatedEvent")
                    {
                        Interlocked.Increment(ref _tradeId);
                    }
                },
                _ => tcs.TrySetResult(new object()));
        }

        public async Task<long> GetNextId()
        {
            await _gotLatestEvent;
            return Interlocked.Increment(ref _tradeId);
        }

        public void Dispose()
        {
            Log.Warn("Not disposed.");
        }
    }
}