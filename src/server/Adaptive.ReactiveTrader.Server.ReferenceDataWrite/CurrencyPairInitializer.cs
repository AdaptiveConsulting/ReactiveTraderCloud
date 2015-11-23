using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class CurrencyPairInitializer
    {
        private readonly ICurrencyPairRepository _repository;

        public CurrencyPairInitializer(ICurrencyPairRepository repository)
        {
            _repository = repository;
        }

        public async Task WriteInitialEventsAsync()
        {
            await Task.WhenAll(
                _repository.Create("EURUSD", 4, 5, 1.3629m),
                _repository.Create("USDJPY", 2, 3, 102.14m),
                _repository.Create("GBPUSD", 4, 5, 1.6395m, "Server waits 1.5sec to execute then sends a trade done."),
                _repository.Create("GBPJPY", 2, 3, 167.67m, "Always rejects upon execution."),
                _repository.Create("EURGBP", 4, 5, 0.8312m),
                _repository.Create("USDCHF", 4, 5, 0.897m),
                _repository.Create("EURJPY", 2, 3, 139.22m, "Waits 5sec before sending a trade response (times-out)."),
                _repository.Create("EURCHF", 4, 5, 1.2224m, "Server waits before sending a first price update."),
                _repository.Create("AUDUSD", 4, 5, 0.8925m),
                _repository.Create("NZDUSD", 4, 5, 0.8263m),
                _repository.Create("EURCAD", 4, 5, 1.5062m),
                _repository.Create("EURAUD", 4, 5, 1.5256m),
                _repository.Create("AUDCAD", 4, 5, 0.9873m),
                _repository.Create("GBPCHF", 4, 5, 1.4723m),
                _repository.Create("CHFJPY", 2, 3, 113.8591m),
                _repository.Create("AUDJPY", 2, 3, 91.3133m),
                _repository.Create("AUDNZD", 4, 5, 1.0807m),
                _repository.Create("CADJPY", 2, 3, 92.4686m),
                _repository.Create("CHFUSD", 4, 5, 1.1148m),
                _repository.Create("EURNOK", 4, 4, 8.3613m),
                _repository.Create("EURSEK", 4, 4, 8.8505m));

            await Task.WhenAll(
                _repository.Activate("EURUSD"),
                _repository.Activate("USDJPY"),
                _repository.Activate("GBPUSD"),
                _repository.Activate("GBPJPY"));
        }
    }
}
