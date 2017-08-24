using System;
using System.Collections.Generic;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using Adaptive.ReactiveTrader.Client.Concurrency;
using Adaptive.ReactiveTrader.Client.Domain;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Client.iOS.Shared;
using Foundation;
using System.Linq;
using UIKit;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;

namespace Adaptive.ReactiveTrader.Client.iOSTab
{
    public class NotificationGenerator
    {
        readonly IReactiveTrader _reactiveTrader;
        readonly IConcurrencyService _concurrencyService;
        readonly CompositeDisposable _disposables = new CompositeDisposable();
        readonly Dictionary<string, ICurrencyPair> _currenyPairs = new Dictionary<string, ICurrencyPair>();

        public ISubject<bool> NotificationsEnabled { get; } = new BoolUserDefault("notificationsEnabled");

        public NotificationGenerator(IReactiveTrader reactiveTrader, IConcurrencyService concurrencyService)
        {
            _reactiveTrader = reactiveTrader;
            _concurrencyService = concurrencyService;

            NotificationsEnabled
                .Where(enabled => enabled)
                .Subscribe(_ => RegisterNotifications())
                .Add(_disposables);
        }

        public void Initialise()
        {
            _reactiveTrader
                .TradeRepository
                .GetTradesStream()
                .SubscribeOn(_concurrencyService.TaskPool)
                .ObserveOn(_concurrencyService.Dispatcher)
                .Skip(2) // Skip over past trades on start up
                .WhereLatest(NotificationsEnabled)
                .SelectMany(trades => trades)
                .Where(trade => trade.TradeStatus == TradeStatus.Done)
                .Subscribe(OnTrade)
                .Add(_disposables);

            _reactiveTrader
                .ReferenceData
                .GetCurrencyPairsStream()
                .SelectMany(x => x)
                .Where(update => update.UpdateType == UpdateType.Add)
                .Subscribe(update => _currenyPairs[update.CurrencyPair.BaseCurrency + update.CurrencyPair.CounterCurrency] = update.CurrencyPair);
        }

        public void Dispose()
        {
            _disposables.Dispose();
        }

        public static void RegisterNotifications()
        {
            var action = new UIMutableUserNotificationAction
                {
                    Title = "Launch",
                    Identifier = "trade",
                    ActivationMode = UIUserNotificationActivationMode.Foreground,
                    AuthenticationRequired = false
                };

            var actionCategory = new UIMutableUserNotificationCategory { Identifier = "trade" };

            var categories = new NSMutableSet();
            categories.Add(actionCategory);

            actionCategory.SetActions(new UIUserNotificationAction[] { action }, UIUserNotificationActionContext.Default);

            var settings = UIUserNotificationSettings.GetSettingsForTypes(UIUserNotificationType.Alert | UIUserNotificationType.Sound, categories);
            UIApplication.SharedApplication.RegisterUserNotificationSettings(settings);
        }

        void OnTrade(ITrade trade)
        {
            Console.WriteLine("WatchNotification: trade made");                 

            var boughtOrSold = trade.Direction == Direction.BUY ? "bought" : "sold";

            var currencyOne = trade.CurrencyPair.Substring(0, 3);
            var currencyTwo = trade.CurrencyPair.Substring(3, 3);
            var currentyPair = _currenyPairs[trade.CurrencyPair];

            var userInfo = new NSMutableDictionary
            {
                { (NSString)"trade", trade.ToNSString() },
                { WormHoleConstants.CurrencyPairKey, currentyPair.ToNSString() },
                { (NSString)"baseCurrency", (NSString)currencyOne },
                { (NSString)"counterCurrency", (NSString)currencyTwo }
            };

            var notification = new UILocalNotification
            {
                AlertBody = $"'{trade.TraderName}' {boughtOrSold} {trade.Notional:n0} {trade.DealtCurrency} vs {currencyTwo} at {trade.SpotRate}",
                Category = "trade",
                UserInfo = userInfo,
                AlertTitle = "Trade Executed",
                AlertAction = $"Show {currencyOne} / {currencyTwo}",
                HasAction = true,
                SoundName = UILocalNotification.DefaultSoundName
            };
            
            Console.WriteLine("WatchNotification: sending from iPhone " + notification.AlertBody);                 
            UIApplication.SharedApplication.PresentLocalNotificationNow(notification);
        }
    }
}

