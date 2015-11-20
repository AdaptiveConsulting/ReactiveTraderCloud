using System;
using System.Collections.Generic;
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

        public PriceGenerator()
        {
            var priceGenerators = new List<IPriceGenerator>
            {
                CreatePriceGenerator("EURUSD", 1.3629m),
                CreatePriceGenerator("USDJPY", 100.200m),
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

                    var disp = Observable.Interval(TimeSpan.FromSeconds(5)).Subscribe(o =>
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


    public interface IPriceGenerator
    {
        IEnumerable<SpotPriceDto> Sequence();
        string Symbol { get; }
    }

    public static class DateTimeExtensions
    {
        public static DateTime ToWeekday(this DateTime date)
        {
            switch (date.DayOfWeek)
            {
                case DayOfWeek.Saturday:
                    return date.AddDays(2);
                case DayOfWeek.Sunday:
                    return date.AddDays(1);
                default:
                    return date;
            }
        }
    }
}