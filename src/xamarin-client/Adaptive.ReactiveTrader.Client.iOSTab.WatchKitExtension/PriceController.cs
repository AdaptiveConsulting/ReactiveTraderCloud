using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;
using Adaptive.ReactiveTrader.Client.iOS.Shared;
using Adaptive.ReactiveTrader.Client.UI.SpotTiles;
using Foundation;
using UIKit;
using WatchKit;

namespace Adaptive.ReactiveTrader.Client.iOSTab.WatchKitExtension
{
	partial class PriceController : WKInterfaceController
	{
		public PriceController (IntPtr handle) : base (handle)
		{
		}

        ICurrencyPair _pair;
        IPrice _price;
        bool _executing;
        CompositeDisposable _disposables = new CompositeDisposable();

        public override void Awake(NSObject context)
        {
            base.Awake(context);

            _pair = PairFromContext(context);

            if (_pair == null)
            {
                return;
            }

            if (Pairs.NotificationCurrencyPair != null && Pairs.NotificationCurrencyPair.Matches(_pair))
            {
                BecomeCurrentPage();
                Pairs.NotificationCurrencyPair = null;
            }

            SetTitle($"{_pair.BaseCurrency} / {_pair.CounterCurrency}");
        }

        public override void WillActivate()
        {
            base.WillActivate();

            if (_pair == null)
            {
                return;
            }

            _disposables = new CompositeDisposable();
            var stream = _pair.PriceStream;

            stream.Subscribe(price => _price = price).Add(_disposables);

            stream
                .Where(price => !price.IsStale && !_executing)
                .Select(price => price.ToBidPrice().ToAttributedString())
                .Subscribe(SellPriceLabel.SetText)
                .Add(_disposables);

            stream
                .Where(price => !price.IsStale && !_executing)
                .Select(price => price.ToAskPrice().ToAttributedString())
                .Subscribe(BuyPriceLabel.SetText)
                .Add(_disposables);

            stream
                .Where(price => !price.IsStale)
                .ToPriceMovementStream()
                .DistinctUntilChanged()                    
                .Select(movement => movement.ToAttributedString(_price))
                .Where(_ => !_executing)
                .Subscribe(PriceLabel.SetText)
                .Add(_disposables);

            stream
                .Select(price => price.IsStale)
                .DistinctUntilChanged()
                .Subscribe(isStale => 
                {
                    SetStatus(isStale, BuyButton);
                    SetStatus(isStale, SellButton);
                })
                .Add(_disposables);
        }

        public override void DidDeactivate()
        {
            _disposables.Dispose();
            base.DidDeactivate();
        }

        void SetStatus(bool isStale, WKInterfaceButton button)
        {
            if (isStale)
            {
                button.SetBackgroundColor(UIColor.Red);
                button.SetTitle("-");
            }
            else
            {
                button.SetBackgroundColor(UIColor.FromRGBA(red: 0.16f, green: 0.26f, blue: 0.4f, alpha: 1f));
            }
        }

        partial void SellButtonTapped()
        {
            if (_price != null)
            {
                ExecuteTrade(_price, _price.Bid, SellPriceLabel);
            }
        }

        partial void BuyButtonTapped()
        {     
            if (_price != null)
            {
                ExecuteTrade(_price, _price.Ask, BuyPriceLabel);
            }
        }

        void ExecuteTrade(IPrice price, IExecutablePrice executablePrice, WKInterfaceLabel label)
        {
            if (price == null)
            {
                throw new ArgumentNullException("price");
            }

            if (price == null || price.IsStale || _executing)
            {
                return;
            }

            _executing = true;
            label.SetText("Executing...");

            executablePrice.ExecuteRequest(100930, _pair.BaseCurrency)
                .Subscribe(result => 
                    {
                        _executing = false;
                        ShowConfirmation(result.Update);
                        label.SetText("");
                    })
                .Add(_disposables);
        }

        void ShowConfirmation(ITrade trade)
        {
            if (trade == null)
            {
                throw new ArgumentNullException("trade");
            }

            Trades.Shared[trade.TradeId] = trade;
                 
            InvokeOnMainThread(() => 
                PresentController(TradeConfirmController.Name, new NSNumber(trade.TradeId))
            );
        }

        static ICurrencyPair PairFromContext(NSObject context)
        {
            if (context == null)
            {
                return null;
            }

            var index = ((NSNumber)context).Int32Value;

            if (Pairs.Shared.Count < index)
            {
                Console.WriteLine("No pair");
                return null;
            }

            return Pairs.Shared[index];
        }
	}
}
