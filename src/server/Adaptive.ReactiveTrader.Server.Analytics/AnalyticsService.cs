namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsService
    {
        private readonly IObservable<TradesDto> _tradesRepository;

        public AnalyticsService(IObservable<TradesDto> tradesRepository)
        {
            _tradesRepository = tradesRepository;
        }

        public IObservable<TradesDto> GetTradesStream()
        {
            return _tradesRepository;
        }
    }
}