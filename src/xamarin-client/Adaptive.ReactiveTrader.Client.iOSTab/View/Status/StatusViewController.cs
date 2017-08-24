using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using Adaptive.ReactiveTrader.Client.Concurrency;
using Adaptive.ReactiveTrader.Client.Domain;
using Adaptive.ReactiveTrader.Client.iOS.Shared;
using Foundation;
using UIKit;

namespace Adaptive.ReactiveTrader.Client.iOSTab.View
{
	public partial class StatusViewController : UIViewController
	{
		private readonly IReactiveTrader _reactiveTrader;
		private readonly IConcurrencyService _concurrencyService;
		private readonly CompositeDisposable _disposables = new CompositeDisposable();

		private ConnectionInfo _lastConnectionInfo;

        ISubject<bool> _notificationsEnabled;

        public StatusViewController (IReactiveTrader reactiveTrader, IConcurrencyService concurrencyService, ISubject<bool> notificationsEnabled) : base ("StatusViewController", null)
		{
            _notificationsEnabled = notificationsEnabled;
			_reactiveTrader = reactiveTrader;
			_concurrencyService = concurrencyService;

			Title = "Status";
			TabBarItem.Image = UIImage.FromBundle ("tab_status");

			_disposables.Add (
				_reactiveTrader.ConnectionStatusStream
					.SubscribeOn (_concurrencyService.TaskPool)
					.ObserveOn (_concurrencyService.Dispatcher)
					.Subscribe (OnStatusChange));

			_disposables.Add (
				Observable.Interval (TimeSpan.FromSeconds(1), _concurrencyService.TaskPool)
					.ObserveOn (_concurrencyService.Dispatcher)
					.Subscribe(_ => OnTimer()));
		}

		protected override void Dispose (bool disposing)
		{	
			base.Dispose (disposing);

			if (disposing) {
				_disposables.Dispose();
			}
		}

		public override void ViewDidLoad ()
		{
			base.ViewDidLoad ();

            UIEdgeInsets adjustForTabbarInsets = new UIEdgeInsets(UIApplication.SharedApplication.StatusBarFrame.Height, 0, TabBarController.TabBar.Frame.Height, 0);
            _scrollView.ContentInset = adjustForTabbarInsets;
            _scrollView.ScrollIndicatorInsets = adjustForTabbarInsets;

			this.TraderId.Text = UserModel.Instance.TraderId;

			if (_lastConnectionInfo != null) {
				OnStatusChange (_lastConnectionInfo);
				_lastConnectionInfo = null;
			}

            _notificationsSwitch.Bind(_notificationsEnabled)
                .Add(_disposables);
		}

		private void OnStatusChange(ConnectionInfo connectionInfo)
		{
			if (this.IsViewLoaded) {
				this.ConnectionDetail.Text = connectionInfo.Server;
				this.ConnectionDetail.SizeToFit (); // Multi-line, with initially small height.
				this.ConnectionStatus.Text = connectionInfo.ConnectionStatus.ToString ();
			} else {
				_lastConnectionInfo = connectionInfo;
			}
		}

		private void OnTimer()
		{
			var statistics = _reactiveTrader.PriceLatencyRecorder.CalculateAndReset ();

			if (this.IsViewLoaded) {
				this.ServerUpdateRate.Text = string.Format ("{0} / sec", statistics.ReceivedCount);
				this.UIUpdateRate.Text = string.Format ("{0} / sec", statistics.RenderedCount);
				this.UILatency.Text = string.Format ("{0} ms", statistics.RenderedCount);
			}
		}

		partial void LinkTouchUpInside (NSObject sender)
		{
            var url = new NSUrl("http://www.weareadaptive.com");
            UIApplication.SharedApplication.OpenUrl(url);
		}
	}
}

