using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Server.ReferenceDataWrite.Domain;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class CurrencyPairInitializer
    {
        private readonly IRepository _repository;

        public CurrencyPairInitializer(IRepository repository)
        {
            _repository = repository;
        }

        public async Task CreateInitialCurrencyPairsAsync()
        {
            await Task.WhenAll(
               CreateCurrencyPair("EURUSD", 4, 5, 1.3629m, activate: true),
               CreateCurrencyPair("USDJPY", 2, 3, 102.14m, activate: true),
               CreateCurrencyPair("GBPUSD", 4, 5, 1.6395m, "Server waits 1.5sec to execute then sends a trade done.", activate: true),
               CreateCurrencyPair("GBPJPY", 2, 3, 167.67m, "Always rejects upon execution.", activate: true),
               CreateCurrencyPair("EURGBP", 4, 5, 0.8312m),
               CreateCurrencyPair("USDCHF", 4, 5, 0.897m),
               CreateCurrencyPair("EURJPY", 2, 3, 139.22m, "Waits 5sec before sending a trade response (times-out)."),
               CreateCurrencyPair("EURCHF", 4, 5, 1.2224m, "Server waits before sending a first price update."),
               CreateCurrencyPair("AUDUSD", 4, 5, 0.8925m),
               CreateCurrencyPair("NZDUSD", 4, 5, 0.8263m),
               CreateCurrencyPair("EURCAD", 4, 5, 1.5062m),
               CreateCurrencyPair("EURAUD", 4, 5, 1.5256m),
               CreateCurrencyPair("AUDCAD", 4, 5, 0.9873m),
               CreateCurrencyPair("GBPCHF", 4, 5, 1.4723m),
               CreateCurrencyPair("CHFJPY", 2, 3, 113.8591m),
               CreateCurrencyPair("AUDJPY", 2, 3, 91.3133m),
               CreateCurrencyPair("AUDNZD", 4, 5, 1.0807m),
               CreateCurrencyPair("CADJPY", 2, 3, 92.4686m),
               CreateCurrencyPair("CHFUSD", 4, 5, 1.1148m),
               CreateCurrencyPair("EURNOK", 4, 4, 8.3613m),
               CreateCurrencyPair("EURSEK", 4, 4, 8.8505m));
        }

        private Task CreateCurrencyPair(string symbol, int pipsPosition, int ratePrecision, decimal sampleRate, string comment = null, bool activate = false)
        {
            var cp = new CurrencyPair(symbol, pipsPosition, ratePrecision, sampleRate, comment);

            if (activate)
            {
                cp.Activate();
            }

            return _repository.SaveAsync(cp);
        }
    }
}
