using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Concurrency;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;
using Adaptive.ReactiveTrader.Client.Domain.Transport;
using Foundation;
using WatchKit;

namespace Adaptive.ReactiveTrader.Client.iOSTab.WatchKitExtension
{
    static class Pairs
    {
        public static List<ICurrencyPair> Shared = new List<ICurrencyPair>();
        public static NotificationCurrencyPair NotificationCurrencyPair { get; set; }
    }

    static class Trades
    {
        public static Dictionary<long, ITrade> Shared = new Dictionary<long, ITrade>();
    }

	partial class InitialController : WKInterfaceController
	{
		public InitialController (IntPtr handle) : base (handle)
		{
		}

        public override void WillActivate()
        {
            base.WillActivate();
            Setup();
        }

        public override void HandleLocalNotificationAction(string identifier, UIKit.UILocalNotification localNotification)
        {
            Console.WriteLine($"HandleLocalNotificationAction: {identifier}");

            var baseCurrency = (string)(NSString)localNotification.UserInfo.ValueForKey((NSString)"baseCurrency");
            var counterCurrency = (string)(NSString)localNotification.UserInfo.ValueForKey((NSString)"counterCurrency");
            Pairs.NotificationCurrencyPair = new NotificationCurrencyPair(baseCurrency, counterCurrency);

            base.HandleLocalNotificationAction(identifier, localNotification);
        }

        Adaptive.ReactiveTrader.Client.Domain.ReactiveTrader _reactiveTrader;

        void ReloadControllers()
        {
            var names = Enumerable.Repeat("price", Pairs.Shared.Count).ToArray();

            var contexts = Pairs.Shared.Select((pair, i) => new NSNumber(i)).ToArray();

            InvokeOnMainThread(
                () => ReloadRootControllers(names, contexts)
            );
        }

        void Setup()
        {
            SetTitle("Connecting");

            _reactiveTrader = new Domain.ReactiveTrader();
            _reactiveTrader.Initialize (UserModel.Instance.TraderId, new [] { "https://reactivetrader.azurewebsites.net/signalr" });  
            _reactiveTrader.ConnectionStatusStream
                .Where(ci => ci.ConnectionStatus == ConnectionStatus.Connected)
                .Timeout(TimeSpan.FromSeconds (15))
                .ObserveOn(new EventLoopScheduler())
                .Subscribe(
                    _ => 
                    {
                        SetTitle("Connected");
                        Pairs.Shared.Clear();
                    },
                    ex => SetTitle("No connection")
                );

            _reactiveTrader
                .ConnectionStatusStream
                .Where(stream => stream.ConnectionStatus == ConnectionStatus.Closed)
                .Subscribe(_ => Pairs.Shared.Clear());

            IObservable<ICurrencyPairUpdate> onCurrencyPair = 
                _reactiveTrader.ReferenceData
                    .GetCurrencyPairsStream()
                    .SelectMany(update => update);

            onCurrencyPair
                .Where(update => update.UpdateType == UpdateType.Add)                
                .Where(update => !Pairs.Shared.Any(x => x.Symbol == update.CurrencyPair.Symbol))
                .Subscribe(update => Pairs.Shared.Add(update.CurrencyPair));

            onCurrencyPair
                .Where(update => update.UpdateType == UpdateType.Remove)
                .Subscribe(update => Pairs.Shared.Remove(update.CurrencyPair));

            onCurrencyPair
                .Throttle(TimeSpan.FromSeconds(1))
                .Subscribe(update => ReloadControllers());
        }
	}
}
