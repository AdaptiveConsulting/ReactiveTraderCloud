using System;
using System.Collections.Generic;
using System.Linq; 
using System.Reactive.Linq;
using System.Security.Principal;
using Foundation;
using UIKit;
using Adaptive.ReactiveTrader.Client.Domain;
using Adaptive.ReactiveTrader.Client.iOSTab.Logging;
using Adaptive.ReactiveTrader.Client.iOSTab.View;
using Adaptive.ReactiveTrader.Client.Domain.Transport;
using System.Runtime.InteropServices;
using CoreAnimation;
using System.Threading.Tasks;
using WormHoleSharp;
using Adaptive.ReactiveTrader.Client.iOS.Shared;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Client.Domain.Models;

namespace Adaptive.ReactiveTrader.Client.iOSTab
{
	// The UIApplicationDelegate for the application. This class is responsible for launching the
	// User Interface of the application, as well as listening (and optionally responding) to
	// application events from iOS.
	[Register("AppDelegate")]
	public partial class AppDelegate : UIApplicationDelegate
	{
		private IReactiveTrader _reactiveTrader;

		// class-level declarations

		UIWindow window;
		UITabBarController tabBarController;

		StartUpView _startUpViewController;

		LoggerFactory _loggerFactory;

		ConcurrencyService _cs;

		NotificationGenerator _notificationHandler;

		//
		// This method is invoked when the application has loaded and is ready to run. In this
		// method you should instantiate the window, load the UI into it and then make the window
		// visible.
		//
		// You have 17 seconds to return from this method, or iOS will terminate your application.
		//
		public override bool FinishedLaunching(UIApplication app, NSDictionary options)
		{
			// Appearance
			UITableView.Appearance.BackgroundColor = Styles.RTDarkerBlue;
			UITableView.Appearance.SeparatorInset = UIEdgeInsets.Zero;
			UITabBar.Appearance.BarTintColor = Styles.RTDarkerBlue;

			// create a new window instance based on the screen size
			window = new UIWindow(UIScreen.MainScreen.Bounds);

			var cs = new ConcurrencyService();
			_cs = cs;

			var logSource = new LogHub();
			_loggerFactory = new LoggerFactory(logSource);

#if DEBUG
			UIApplication.CheckForIllegalCrossThreadCalls = true;
			var logViewController = new LogViewController(cs, logSource);
#endif

			_reactiveTrader = new Adaptive.ReactiveTrader.Client.Domain.ReactiveTrader();
			_startUpViewController = new StartUpView(Initalize);
			Initalize();


			_notificationHandler = new NotificationGenerator(_reactiveTrader, cs);
			_notificationHandler.Initialise();

			var tradesViewController = new TradesViewController(_reactiveTrader, cs);
			var pricesViewController = new PriceTilesViewController(_reactiveTrader, cs);
			var statusViewController = new StatusViewController(_reactiveTrader, cs, _notificationHandler.NotificationsEnabled);

			tabBarController = new UITabBarController();
			tabBarController.ViewControllers = new UIViewController[] {
				pricesViewController,
				tradesViewController,
				statusViewController
				#if DEBUG
				, logViewController
				#endif
			};

			tabBarController.ModalTransitionStyle = UIModalTransitionStyle.CrossDissolve;

			window.RootViewController = _startUpViewController;
			window.MakeKeyAndVisible();

			new WormholeSender(_reactiveTrader);

			return true;
		}


		public override void DidEnterBackground(UIApplication application)
		{
			UIApplication.SharedApplication.BeginBackgroundTask(() => Console.WriteLine("Background time expired"));

			var remaining = TimeSpan.FromSeconds(application.BackgroundTimeRemaining);

			Console.WriteLine($"Background time remaining: {remaining.Minutes}m{remaining.Seconds}s");
		}

		void Initalize()
		{
			_reactiveTrader.Initialize(UserModel.Instance.TraderId, new[] { "https://reactivetrader.azurewebsites.net/signalr" }, _loggerFactory);
			_startUpViewController.DisplayMessages(true, "Connecting..");
			_reactiveTrader.ConnectionStatusStream
				.Where(ci => ci.ConnectionStatus == ConnectionStatus.Connected)
				.Timeout(TimeSpan.FromSeconds(15))
				.ObserveOn(_cs.Dispatcher)
				.Subscribe(
					_ => _startUpViewController.PresentViewController(tabBarController, true, null),
					ex => _startUpViewController.DisplayMessages(false, "Disconnected", "Unable to connect")
				);
		}
	}
}                                                                                                                                                                                          