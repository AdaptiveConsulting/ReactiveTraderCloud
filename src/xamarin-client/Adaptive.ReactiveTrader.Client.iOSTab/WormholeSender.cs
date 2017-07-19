using System;
using Adaptive.ReactiveTrader.Client.Domain;
using WormHoleSharp;
using Adaptive.ReactiveTrader.Client.iOS.Shared;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Shared.DTO.Pricing;
using System.Reactive.Linq;

namespace Adaptive.ReactiveTrader.Client.iOSTab
{
    class WormholeSender
    {
        IDisposable _wormholeSubscription = Disposable.Empty;

        Wormhole _wormhole;

        public WormholeSender(IReactiveTrader reactiveTrader)
        {
            _wormhole = new Wormhole(WormHoleConstants.AppGroup, WormHoleConstants.Directory);
            _wormhole.ListenForMessage<string>(WormHoleConstants.StartUpdates, currencyPair =>
                {
                    Console.WriteLine($"Starting Watch updates for {currencyPair}");

                    _wormholeSubscription.Dispose();

                    _wormholeSubscription = reactiveTrader                        
                        .PricingServiceClient
                        .GetSpotStream(currencyPair)
                        .Distinct(x => x.CreationTimestamp)
                        .Subscribe(price => 
                            {
                                Console.WriteLine($"Sending update for {currencyPair}: {price.Ask} / {price.Bid}");

                                _wormhole.PassMessage(WormHoleConstants.CurrencyUpdate, price);

                            });
                });

            _wormhole.ListenForMessage<string>(WormHoleConstants.StopUpdates, _ =>
                {
                    Console.WriteLine($"Stopping Watch updates");
                    _wormholeSubscription.Dispose();
                });
        }
    }
}
