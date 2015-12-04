using System;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    internal class PricePublisher : IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<PricePublisher>();

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
            Log.InfoFormat("Stopped price publishing to 'prices'");
        }

        public async Task Start()
        {
            var endpoint = await _broker.GetPublicEndPoint<SpotPriceDto>("prices");

            _disp = _priceStream.Subscribe(endpoint);

            Log.InfoFormat("Started price publishing to 'prices'");
        }
    }
}