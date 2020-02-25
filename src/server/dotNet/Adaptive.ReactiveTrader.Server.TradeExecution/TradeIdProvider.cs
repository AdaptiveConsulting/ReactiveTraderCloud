using System;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Server.TradeExecution.Domain;
using EventStore.ClientAPI.Exceptions;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    /// <summary>
    ///     Uses a Hi/Lo algorithm to generate TradeIds
    ///     <see cref="http://stackoverflow.com/questions/282099/whats-the-hi-lo-algorithm" />
    /// </summary>
    public class TradeIdProvider : IDisposable
    {
        private const int HiValueTryCount = 3;
        private const int Multiplier = 100;
        private readonly IRepository _repository;
        private readonly EventLoopScheduler _scheduler = new EventLoopScheduler();
        private int _hiValue;
        private bool _initialized;
        private int _loValue;

        public TradeIdProvider(IRepository repository)
        {
            _repository = repository;
        }

        public void Dispose()
        {
        }

        public async Task<long> GetNextId()
        {
            // Push the actual generation of the ID through the event loop scheduler to serialize things.
            // For what we're trying to demonstrate here we will be fine running everything on a single thread.
            return await Observable.Create<long>(async obs =>
            {
                if (!_initialized || _loValue >= Multiplier)
                {
                    _hiValue = await GetNextHiValue();
                    _loValue = 0;
                    _initialized = true;
                }

                _loValue++;

                obs.OnNext(_hiValue*Multiplier + _loValue);
                obs.OnCompleted();

                return Disposable.Empty;
            })
                                   .SubscribeOn(_scheduler);
        }

        private async Task<int> GetNextHiValue(int triesLeft = HiValueTryCount)
        {
            Exception wrongVersionException = null;

            while (triesLeft > 0)
            {
                try
                {
                    return await GetHiValueFromEventStore();
                }
                catch (WrongExpectedVersionException ex)
                {
                    wrongVersionException = ex;
                    triesLeft--;
                    Log.Warning("Got wrong version when trying to increment TradeId. {triesLeft} tries left", triesLeft);
                }
            }

            throw new IdGenerationFailedException($"Unable to get next TradeId from Event Store after {HiValueTryCount} tries", wrongVersionException);
        }

        private async Task<int> GetHiValueFromEventStore()
        {
            TradeId tradeId;

            try
            {
                tradeId = await _repository.GetById<TradeId>(null);
            }
            catch (AggregateNotFoundException)
            {
                tradeId = new TradeId();
            }

            tradeId.IncrementId();

            await _repository.SaveAsync(tradeId);

            return tradeId.Version;
        }
    }
}
