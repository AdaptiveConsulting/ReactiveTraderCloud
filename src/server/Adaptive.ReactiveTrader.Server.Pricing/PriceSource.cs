using System;
using System.Collections.Generic;
using System.Reactive;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public sealed class PriceSource : IDisposable
    {
        private readonly Dictionary<string, IObservable<SpotPriceDto>> _priceStreams =
            new Dictionary<string, IObservable<SpotPriceDto>>();

        private readonly CompositeDisposable _disposable = new CompositeDisposable();

        public PriceSource()
        {
            var priceGenerators = new List<IPriceGenerator>
            {
                CreatePriceGenerator("EURUSD", 1.09443m),
                CreatePriceGenerator("USDJPY", 121.656m),
                CreatePriceGenerator("GBPUSD", 1.51746m),
                CreatePriceGenerator("GBPJPY", 184.608m),
                CreatePriceGenerator("EURGBP", 0.72123m),
                CreatePriceGenerator("USDCHF", 0.98962m),
                CreatePriceGenerator("EURJPY", 133.144m),
                CreatePriceGenerator("EURCHF", 1.08318m),
                CreatePriceGenerator("AUDUSD", 0.72881m),
                CreatePriceGenerator("NZDUSD", 0.6729m),
                CreatePriceGenerator("EURCAD", 1.48363m),
                CreatePriceGenerator("EURAUD", 1.50157m),
                CreatePriceGenerator("AUDCAD", 0.98805m),
                CreatePriceGenerator("GBPCHF", 1.50193m),
                CreatePriceGenerator("CHFJPY", 122.914m),
                CreatePriceGenerator("AUDJPY", 88.666m),
                CreatePriceGenerator("AUDNZD", 1.08334m),
                CreatePriceGenerator("CADJPY", 89.7685m),
                CreatePriceGenerator("CHFUSD", 1.01027m),
                CreatePriceGenerator("EURNOK", 9.44156m),
                CreatePriceGenerator("EURSEK", 9.26876m)
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

                    _disposable.Add(disp);

                    return disp;
                })
                                           .Replay(1)
                                           .RefCount();

                _priceStreams.Add(ccy.Symbol, observable);
            }
        }

        public void Dispose()
        {
            _disposable.Dispose();
        }

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

        public IObservable<SpotPriceDto> GetPriceStream(string symbol)
        {
            return _priceStreams[symbol];
        }

        public IObservable<SpotPriceDto> GetAllPricesStream()
        {
            return _priceStreams.Values.Merge();
        }
    }
}