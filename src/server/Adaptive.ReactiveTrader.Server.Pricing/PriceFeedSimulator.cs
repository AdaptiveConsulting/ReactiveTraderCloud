using System;
using System.Threading;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PriceFeedSimulator : IPriceFeed, IDisposable
    {
        private const int MinPeriodMilliseconds = 15;   //Timer resolution is about 15ms
        //private readonly ICurrencyPairRepository _currencyPairRepository;
        private readonly IPricePublisher _pricePublisher;
        private readonly IPriceLastValueCache _priceLastValueCache;
        //private readonly IAnalyticsService _analyticsService;
        private readonly Random _random;
        private Timer _timer;
        private int _updatesPerTick = 1;
        private double _updatesPerSecond;

        public PriceFeedSimulator(
            //ICurrencyPairRepository currencyPairRepository,
            IPricePublisher pricePublisher,
            IPriceLastValueCache priceLastValueCache,
            IExchangeRateProvider exchangeRateProvider
            //IAnalyticsService analyticsService
            )
        {
            //_currencyPairRepository = currencyPairRepository;
            _pricePublisher = pricePublisher;
            _priceLastValueCache = priceLastValueCache;
            //_analyticsService = analyticsService;
            _random = new Random(/*_currencyPairRepository.GetHashCode()*/);
        }

        public void Start()
        {
            PopulateLastValueCache();

            SetUpdateFrequency(MinPeriodMilliseconds);
        }

        public void SetUpdateFrequency(double updatesPerSecond)
        {
            _updatesPerSecond = updatesPerSecond;

            _timer?.Dispose();

            var periodMs = 1000.0 / updatesPerSecond;

            if (periodMs < (MinPeriodMilliseconds + 1)) // Instead of trying to fire more often than timer resolution allows, start pushing more updates per tick.
            {
                _updatesPerTick = (int)(MinPeriodMilliseconds / periodMs);
                periodMs = MinPeriodMilliseconds;
            }
            else
            {
                _updatesPerTick = 1;
            }

            _timer = new Timer(OnTimerTick, null, (int)periodMs, (int)periodMs);
        }

        public double GetUpdateFrequency()
        {
            return _updatesPerSecond;
        }

        private void PopulateLastValueCache()
        {
            // TODO: read eventstore ccy pairs
            //foreach (var currencyPairInfo in _currencyPairRepository.GetAllCurrencyPairs())
            //{
            //    var mid = _currencyPairRepository.GetSampleRate(currencyPairInfo.CurrencyPair.Symbol);

            //    var initialQuote = new PriceDto
            //    {
            //        Symbol = currencyPairInfo.CurrencyPair.Symbol,
            //        Mid = mid
            //    };

            //    _priceLastValueCache.StoreLastValue(currencyPairInfo.GenerateNextQuote(initialQuote));
            //}
        }

        private void OnTimerTick(object state)
        {
            // TODO: publish prices
            //var activePairs = _currencyPairRepository.GetAllCurrencyPairInfos().Where(cp => cp.Enabled && !cp.Stale).ToList();

            //if (activePairs.Count == 0)
            //    return;

            //for (int i = 0; i < _updatesPerTick; i++)
            //{
            //    var randomCurrencyPairInfo = activePairs[_random.Next(0, activePairs.Count)];
            //    var lastPrice = _priceLastValueCache.GetLastValue(randomCurrencyPairInfo.CurrencyPair.Symbol);

            //    var newPrice = randomCurrencyPairInfo.GenerateNextQuote(lastPrice);
            //    _priceLastValueCache.StoreLastValue(newPrice);
            //    _pricePublisher.Publish(newPrice);
            //    _analyticsService.OnPrice(newPrice);
            //}
        }

        public void Dispose()
        {
            using (_timer)
            { }
        }
    }
}
