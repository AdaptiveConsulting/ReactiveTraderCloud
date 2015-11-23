using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PricingService : IPricingService
    {
        private readonly Func<string, IObservable<SpotPriceDto>> _getPriceStream;

        public PricingService(Func<string, IObservable<SpotPriceDto>> getPriceStream)
        {
            _getPriceStream = getPriceStream;
        }
        
        public IDisposable GetPriceUpdates(IRequestContext context, GetSpotStreamRequestDto request,
            IObserver<SpotPriceDto> streamHandler)
        {
            return _getPriceStream(request.symbol).Subscribe(streamHandler);
        }
    }
}