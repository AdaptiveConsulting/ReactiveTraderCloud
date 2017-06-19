// WARNING
//
// This file has been generated automatically by Xamarin Studio from the outlets and
// actions declared in your storyboard file.
// Manual changes to this file will not be maintained.
//
using Foundation;
using System;
using System.CodeDom.Compiler;
using UIKit;

namespace Adaptive.ReactiveTrader.Client.iOSTab.View
{
	[Register ("StatusViewController")]
	partial class StatusViewController
	{
		[Outlet]
		UIKit.UISwitch _notificationsSwitch { get; set; }

		[Outlet]
		UIKit.UILabel ConnectionDetail { get; set; }

		[Outlet]
		UIKit.UILabel ConnectionStatus { get; set; }

		[Outlet]
		UIKit.UILabel ServerUpdateRate { get; set; }

		[Outlet]
		UIKit.UILabel TraderId { get; set; }

		[Outlet]
		UIKit.UILabel UILatency { get; set; }

		[Outlet]
		UIKit.UILabel UIUpdateRate { get; set; }

		[Outlet]
		[GeneratedCode ("iOS Designer", "1.0")]
		UIScrollView _scrollView { get; set; }

		[Action ("LinkTouchUpInside:")]
		partial void LinkTouchUpInside (Foundation.NSObject sender);

		void ReleaseDesignerOutlets ()
		{
			if (_notificationsSwitch != null) {
				_notificationsSwitch.Dispose ();
				_notificationsSwitch = null;
			}
			if (_scrollView != null) {
				_scrollView.Dispose ();
				_scrollView = null;
			}
			if (ConnectionDetail != null) {
				ConnectionDetail.Dispose ();
				ConnectionDetail = null;
			}
			if (ConnectionStatus != null) {
				ConnectionStatus.Dispose ();
				ConnectionStatus = null;
			}
			if (ServerUpdateRate != null) {
				ServerUpdateRate.Dispose ();
				ServerUpdateRate = null;
			}
			if (TraderId != null) {
				TraderId.Dispose ();
				TraderId = null;
			}
			if (UILatency != null) {
				UILatency.Dispose ();
				UILatency = null;
			}
			if (UIUpdateRate != null) {
				UIUpdateRate.Dispose ();
				UIUpdateRate = null;
			}
		}
	}
}
