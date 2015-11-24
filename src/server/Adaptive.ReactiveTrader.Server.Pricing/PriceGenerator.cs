using System;
using System.Collections.Generic;
using System.Reactive;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public sealed class PriceGenerator
    {
        private readonly Dictionary<string, IObservable<SpotPriceDto>> _priceStreams =
            new Dictionary<string, IObservable<SpotPriceDto>>();

        private static IPriceGenerator CreatePriceGenerator(string symbol, decimal initial, int precision = 4)
        {
            return new RandomWalkPriceGenerator(symbol, initial, precision);
        }

        private static IObservable<Unit> CreatePriceTrigger(bool delayPeriods)
        {
            if (delayPeriods)
                return
                    Observable.Interval(TimeSpan.FromSeconds(0.5))
                        .Take(TimeSpan.FromSeconds(30))
                        .Concat(Observable.Interval(TimeSpan.FromSeconds(10)).Take(1))
                        .Repeat()
                        .Select(_ => Unit.Default);

            return Observable.Interval(TimeSpan.FromSeconds(0.5)).Select(_ => Unit.Default);
        }


        public PriceGenerator()
        {
            var priceGenerators = new List<IPriceGenerator>
            {
                CreatePriceGenerator("EURUSD", 1.3629m),
                CreatePriceGenerator("USDJPY", 100.20m),
                CreatePriceGenerator("GBPUSD", 1.5200m),
                CreatePriceGenerator("GBPJPY", 160.200m),
            };

            foreach (var ccy in priceGenerators)
            {
                var observable = Observable.Create<SpotPriceDto>(observer =>
                {
                    var prices = ccy.Sequence().GetEnumerator();

                    prices.MoveNext();
                    observer.OnNext(prices.Current);

                    var disp = CreatePriceTrigger(ccy.Symbol == "GBPJPY").Subscribe(o =>
                    {
                        prices.MoveNext();
                        observer.OnNext(prices.Current);
                    });

                    return disp;
                })
                    .Replay(1)
                    .RefCount();

                _priceStreams.Add(ccy.Symbol, observable);
            }
        }

        public IObservable<SpotPriceDto> GetPriceStream(string symbol)
        {
            return _priceStreams[symbol];
        }
    }
}