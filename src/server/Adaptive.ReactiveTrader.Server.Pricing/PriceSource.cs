using Adaptive.ReactiveTrader.Contract;
using System;
using System.Collections.Generic;
using System.Reactive;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
  public sealed class PriceSource : IDisposable
  {
    private static readonly Random Random = new Random();

    private readonly Dictionary<string, IObservable<SpotPriceDto>> _priceStreams = new Dictionary<string, IObservable<SpotPriceDto>>();
    private readonly List<IPriceGenerator> _priceGenerators;
    private readonly CompositeDisposable _disposable = new CompositeDisposable();
    private readonly IConnectableObservable<long> _timer;

    public PriceSource()
    {
      _timer = Observable.Interval(TimeSpan.FromMilliseconds(50)).Publish();

      _priceGenerators = new List<IPriceGenerator>
            {
                CreatePriceGenerator("EURUSD", 1.09443m, 5),
                CreatePriceGenerator("USDJPY", 121.656m, 3),
                CreatePriceGenerator("GBPUSD", 1.51746m, 5),
                CreatePriceGenerator("GBPJPY", 184.608m, 3),
                CreatePriceGenerator("EURGBP", 0.72123m, 5),
                CreatePriceGenerator("USDCHF", 0.98962m, 5),
                CreatePriceGenerator("EURJPY", 133.144m, 3),
                CreatePriceGenerator("EURCHF", 1.08318m, 5),
                CreatePriceGenerator("AUDUSD", 0.72881m, 5),
                CreatePriceGenerator("NZDUSD", 0.6729m, 5),
                CreatePriceGenerator("EURCAD", 1.48363m, 5),
                CreatePriceGenerator("EURAUD", 1.50157m, 5),
                CreatePriceGenerator("AUDCAD", 0.98805m, 5),
                CreatePriceGenerator("GBPCHF", 1.50193m, 5),
                CreatePriceGenerator("CHFJPY", 122.914m, 3),
                CreatePriceGenerator("AUDJPY", 88.666m, 3),
                CreatePriceGenerator("AUDNZD", 1.08334m, 5),
                CreatePriceGenerator("CADJPY", 89.7685m, 3),
                CreatePriceGenerator("CHFUSD", 1.01027m, 5),
                CreatePriceGenerator("EURNOK", 9.44156m, 4),
                CreatePriceGenerator("EURSEK", 9.26876m, 4)
            };

      foreach (var ccy in _priceGenerators)
      {
        var observable = Observable.Create<SpotPriceDto>(observer =>
            {
              var prices = ccy.Sequence().GetEnumerator();

              prices.MoveNext();
              observer.OnNext(prices.Current);

              var disp = RegisterPriceTrigger(ccy.Symbol).Subscribe(o =>
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

      _timer.Connect();
    }

    public void Dispose()
    {
      _disposable.Dispose();
    }

    private static IPriceGenerator CreatePriceGenerator(string symbol, decimal initial, int precision)
    {
      return new MeanReversionRandomWalkPriceGenerator(symbol, initial, precision);
    }

    private IObservable<Unit> RegisterPriceTrigger(string symbol)
    {
      return _timer
          .Where(_ => _priceGenerators[Random.Next(_priceGenerators.Count)].Symbol == symbol)
          .Select(_ => Unit.Default);
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
