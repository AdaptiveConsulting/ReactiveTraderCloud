using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.ReferenceDataWrite.Domain;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class ReferenceWriteService : IDisposable
    {
        private static readonly ILog Log = LogManager.GetLogger<ReferenceWriteService>();
        private readonly IRepository _repository;

        public ReferenceWriteService(IRepository repository)
        {
            _repository = repository;
        }

        public async Task ActivateCurrencyPair(IRequestContext context, ActivateCurrencyPairRequestDto request)
        {
            if (Log.IsInfoEnabled)
            {
                Log.Info($"Received activate for currency pair {request.CurrencyPair} for user {context.UserSession.Username}");
            }

            var currencyPair = await _repository.GetById<CurrencyPair>(request.CurrencyPair);
            currencyPair.Activate();

            await _repository.SaveAsync(currencyPair);

            if (Log.IsInfoEnabled)
            {
                Log.Info($"Currency pair {request.CurrencyPair} activated");
            }
        }

        public async Task DeactivateCurrencyPair(IRequestContext context, DeactivateCurrencyPairRequestDto request)
        {
            if (Log.IsInfoEnabled)
            {
                Log.Info($"Received deactivate for currency pair {request.CurrencyPair} for user {context.UserSession.Username}");
            }

            var currencyPair = await _repository.GetById<CurrencyPair>(request.CurrencyPair);
            currencyPair.Deactivate();

            await _repository.SaveAsync(currencyPair);

            if (Log.IsInfoEnabled)
            {
                Log.Info($"Currency pair {request.CurrencyPair} deactivated");
            }
        }

        public void Dispose()
        {
            Log.Warn("Should dispose.");
        }
    }
}