using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Concurrency;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Server.Analytics.Dto;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsEngine
    {
        private readonly IDictionary<string, SpotPriceDto> _priceCache = new Dictionary<string, SpotPriceDto>();
        private readonly IDictionary<string, CurrencyPairTracker> _ccyPairTracker = new Dictionary<string, CurrencyPairTracker>();
        private readonly EventLoopScheduler _eventLoopScheduler = new EventLoopScheduler();
        private PositionUpdatesDto _currentPositionUpdatesDto = new PositionUpdatesDto();
        private readonly object _currentPositionLock = new object();

        public AnalyticsEngine()
        {
            _eventLoopScheduler.SchedulePeriodic(TimeSpan.FromSeconds(10), PublishPositionReport);
        }

        public PositionUpdatesDto CurrentPositionUpdatesDto
        {
            get
            {
                lock (_currentPositionLock)
                {
                    return _currentPositionUpdatesDto;
                }
            }
        }

        public IObservable<PositionUpdatesDto> PositionUpdatesStream
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public void Reset()
        {
            _eventLoopScheduler.Schedule(() =>
            {
                _ccyPairTracker.Clear();
                _currentPositionUpdatesDto.History = Enumerable.Empty<HistoricPositionDto>();
                PublishPositionReport();
            });
        }

        public void OnTrade(TradeDto trade)
        {
            _eventLoopScheduler.Schedule(() =>
            {
                var currencyPair = trade.CurrencyPair;

                var currencyPairTracker = GetTrackerFor(currencyPair);

                currencyPairTracker.OnTrade(trade, _priceCache);
                PublishPositionReport();
            });
        }

        public void OnPrice(SpotPriceDto priceDto)
        {
            _eventLoopScheduler.Schedule(() =>
            {
                _priceCache[priceDto.Symbol] = priceDto;
                var currencyPairTracker = GetTrackerFor(priceDto.Symbol);
                currencyPairTracker.OnPrice(_priceCache, false);
            });
        }

        private void PublishPositionReport()
        {
            var pud = new PositionUpdatesDto
            {
                CurrentPositions = _ccyPairTracker
                    .Values
                    .Where(ccp => ccp.TradeCount > 0)
                    .Select(ccp => new CurrencyPairPositionDto()
                    {
                        Symbol = ccp.CurrencyPair,
                        BasePnl = ccp.CurrentPosition.BasePnl,
                        BaseTradedAmount = ccp.CurrentPosition.BaseTradedAmount
                    })
                    .ToArray()
            };

            var usdPnl = _ccyPairTracker.Values
                         .Where(ccp => ccp.TradeCount > 0)
                         .Sum(ccp => ccp.CurrentPosition.UsdPnl);

            var now = DateTimeOffset.UtcNow;
            var window = now.AddMinutes(-15);

            pud.History = _currentPositionUpdatesDto.History
                                    .Where(hpu => hpu.Timestamp >= window)
                                    .Concat(new[] { new HistoricPositionDto() { Timestamp = now, UsdPnl = usdPnl } })
                                    .ToArray();

            lock (_currentPositionLock)
            {
                _currentPositionUpdatesDto = pud;
            }

            _analyticsPublisher.Publish(pud).Wait(TimeSpan.FromSeconds(10)); todo
        }

        private CurrencyPairTracker GetTrackerFor(string currencyPair)
        {
            CurrencyPairTracker currencyPairTracker;
            if (!_ccyPairTracker.TryGetValue(currencyPair, out currencyPairTracker))
            {
                currencyPairTracker = new CurrencyPairTracker(currencyPair);
                _ccyPairTracker.Add(currencyPair, currencyPairTracker);
            }
            return currencyPairTracker;
        }
    }
}