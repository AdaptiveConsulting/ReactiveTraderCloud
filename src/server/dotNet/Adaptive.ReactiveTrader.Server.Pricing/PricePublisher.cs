using System;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    internal class PricePublisher : IDisposable
    {
        private readonly IBroker _broker;
        private readonly IObservable<SpotPriceDto> _priceStream;
        private IDisposable _disp = Disposable.Empty;

        public PricePublisher(IObservable<SpotPriceDto> priceStream, IBroker broker)
        {
            _priceStream = priceStream;
            _broker = broker;
        }

        public void Dispose()
        {
            _disp.Dispose();
            Log.Information("Stopped price publishing to 'prices'");
        }

        public void Start()
        {
            var endpoint = _broker.GetPublicEndPoint<SpotPriceDto>("prices");

            _disp = _priceStream.Subscribe(endpoint);

            Log.Information("Started price publishing to 'prices'");
        }
    }
}
