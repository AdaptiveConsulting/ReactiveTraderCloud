using System;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Client.Domain.Repositories;

namespace Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData
{
    internal class CurrencyPair : ICurrencyPair
    {
        private readonly Lazy<IObservable<IPrice>> _lazyPriceStream;

        public CurrencyPair(string symbol, int ratePrecision, int pipsPosition, IPriceRepository priceRepository)
        {
            Symbol = symbol;
            RatePrecision = ratePrecision;
            PipsPosition = pipsPosition;
            BaseCurrency = symbol.Substring(0, 3);
            CounterCurrency = symbol.Substring(3, 3);

            _lazyPriceStream = new Lazy<IObservable<IPrice>>(() => CreatePriceStream(priceRepository));
        }


        private IObservable<IPrice> CreatePriceStream(IPriceRepository priceRepository)
        {
            return priceRepository.GetPriceStream(this)
                .Publish()
                .RefCount();
        }

        public string Symbol { get; }
        public int RatePrecision { get; }
        public int PipsPosition { get; }
        public string BaseCurrency { get; }
        public string CounterCurrency { get; }
        public IObservable<IPrice> PriceStream => _lazyPriceStream.Value;
    }
}