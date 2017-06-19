using System;
using WatchKit;
using Foundation;
using UIKit;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.UI.SpotTiles;
using Adaptive.ReactiveTrader.Client.iOS.Shared;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using System.Reactive.Disposables;
using WormHoleSharp;
using System.Reactive.Subjects;
using Adaptive.ReactiveTrader.Shared.DTO.Pricing;
using Adaptive.ReactiveTrader.Client.Domain;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;

namespace Adaptive.ReactiveTrader.Client.iOSTab.WatchKitExtension
{
	public partial class NotificationController : WKUserNotificationInterfaceController
    {
        CompositeDisposable _compositeDisposable = new CompositeDisposable();
        IPrice _price;
        Subject<PriceDto> _priceSubject = new Subject<PriceDto>();
        Wormhole _wormhole;

        LimitedNotificationTrader _trader;

        void SetupWormholePriceStream(ITrade trade)
        {
            if (trade == null)
            {
                throw new ArgumentNullException("trade");
            }

            _priceSubject.Dispose();
            _priceSubject = new Subject<PriceDto>();

            var wormhole = new Wormhole(WormHoleConstants.AppGroup, WormHoleConstants.Directory);
            wormhole.PassMessage(WormHoleConstants.StartUpdates, trade.CurrencyPair);
            wormhole.ListenForMessage<PriceDto>(
                WormHoleConstants.CurrencyUpdate,
                price => 
                {
                    if (price == null)
                    {
                        Console.WriteLine("Watch: wormhole price is null!");
                        return;
                    }

                    Console.WriteLine("Watch: got PriceDto: " + price.Bid + " / " + price.Ask);
                    _priceSubject.OnNext(price);
                }
            );

            _wormhole = wormhole;
        }

        public override void DidReceiveLocalNotification(UILocalNotification localNotification, Action<WKUserNotificationInterfaceType> completionHandler)
        {
            _compositeDisposable.Dispose();
            _compositeDisposable = new CompositeDisposable();

            var trade = GetTrade(localNotification);
            var currencyPair = GetCurrencyPair(localNotification, _priceSubject.AsObservable());

            SetupWormholePriceStream(trade);

            _trader = GetTrader(currencyPair, _priceSubject.AsObservable());
            _compositeDisposable.Add(_trader);

            SetupInterface(trade);
            SetupStreams(_trader);

            completionHandler(WKUserNotificationInterfaceType.Custom);
        }

        static LimitedNotificationTrader GetTrader(ICurrencyPair currencyPair, IObservable<PriceDto> priceStream)
        {
            var trader = new LimitedNotificationTrader();
            trader.Initialize(priceStream, currencyPair);
            return trader;
        }

        static ITrade GetTrade(UILocalNotification localNotification)
        {
            var tradeJson = (NSString)localNotification.UserInfo.ValueForKey(WormHoleConstants.TradeKey);
            return tradeJson.ToTrade();
        }

        static ICurrencyPair GetCurrencyPair(UILocalNotification localNotification, IObservable<PriceDto> priceStream)
        {
            var currencyPairJson = (NSString)localNotification.UserInfo.ValueForKey(WormHoleConstants.CurrencyPairKey); 
            return currencyPairJson.ToCurrencyPair(priceStream);
        }        

        void SetupInterface(ITrade trade)
        {
            _tradeDetailsLabel1.SetText(trade.ToAttributedStringLine1());
            _tradeDetailsLabel2.SetText(trade.ToAttributedStringLine2());
        }

        void SetupStreams(LimitedNotificationTrader trader)
        {
            trader.PriceStream
                .Where(price => !price.IsStale)
                .Subscribe(price =>
                    {
                        _price = price;
                        _sellPriceLabel.SetText(price.ToBidPrice().ToAttributedNotificationString());
                        _buyPriceLabel.SetText(price.ToAskPrice().ToAttributedNotificationString());
                    })
                .Add(_compositeDisposable);

            trader.PriceStream
                .Where(price => price.IsStale)
                .Subscribe(price =>
                    {
                        _sellPriceLabel.SetText("-");
                        _buyPriceLabel.SetText("-");
                        _priceLabel.SetText("");
                    })
                .Add(_compositeDisposable);

            trader.PriceStream
                .Where(price => !price.IsStale)
                .ToPriceMovementStream()
                .Subscribe(priceMovement => 
                    {
                        _arrowLabel.SetText(priceMovement.ToAttributedArrow(_price));
                        _priceLabel.SetText(_price.Spread.ToString("0.0"));
                        SetPricesHidden(false);
                    })
                .Add(_compositeDisposable);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _trader?.Dispose();
                _compositeDisposable.Dispose();

                try
                {
                    _wormhole?.PassMessage(WormHoleConstants.StopUpdates, string.Empty);
                    _wormhole?.Dispose();
                }
                catch (Exception)
                {
                }
            }

            base.Dispose(disposing);
        }

        void SetPricesHidden(bool hidden)
        {
            _priceGroup.SetAlpha(hidden ? 0 : 1);
        }

        public override void DidDeactivate()
        {
            // This method is called when the watch view controller is no longer visible to the user.
            Console.WriteLine("{0} did deactivate", this);

            Dispose(true);
        }
    }
}