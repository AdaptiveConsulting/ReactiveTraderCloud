using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Adaptive.ReactiveTrader.Server.ReferenceDataWrite.Domain;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class ReferenceWriteService : IDisposable
    {
        //private static readonly ILogger Log = Log.ForContext<ReferenceWriteService>();
        private readonly IRepository _repository;

        public ReferenceWriteService(IRepository repository)
        {
            _repository = repository;
        }

        public void Dispose()
        {
            Log.Warning("Should dispose.");
        }

        public async Task ActivateCurrencyPair(IRequestContext context, ActivateCurrencyPairRequestDto request)
        {
            Log.Information("Received activate for currency pair {currencyPair} for user {username}", request.CurrencyPair, context.UserSession.Username);

            var currencyPair = await _repository.GetById<CurrencyPair>(request.CurrencyPair);
            currencyPair.Activate();

            await _repository.SaveAsync(currencyPair);

            Log.Information("Currency pair {currencyPair} activated", request.CurrencyPair);
        }

        public async Task DeactivateCurrencyPair(IRequestContext context, DeactivateCurrencyPairRequestDto request)
        {
            Log.Information("Received deactivate for currency pair {currencyPair} for user {username}", request.CurrencyPair, context.UserSession.Username);

            var currencyPair = await _repository.GetById<CurrencyPair>(request.CurrencyPair);
            currencyPair.Deactivate();

            await _repository.SaveAsync(currencyPair);

            Log.Information("Currency pair {currencyPair} deactivated", request.CurrencyPair);
        }
    }
}