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

namespace Adaptive.ReactiveTrader.Client.iOSTab.WatchKitExtension
{
	[Register ("TradeConfirmController")]
	partial class TradeConfirmController
	{
		[Outlet]
		WatchKit.WKInterfaceButton DoneButton { get; set; }

		[Outlet]
		WatchKit.WKInterfaceLabel TradeDetailsLabel { get; set; }

		[Outlet]
		[GeneratedCode ("iOS Designer", "1.0")]
		WatchKit.WKInterfaceLabel DetailsLabel { get; set; }

		[Action ("DoneTapped")]
		partial void DoneTapped ();

		void ReleaseDesignerOutlets ()
		{
			if (DetailsLabel != null) {
				DetailsLabel.Dispose ();
				DetailsLabel = null;
			}
			if (DoneButton != null) {
				DoneButton.Dispose ();
				DoneButton = null;
			}
		}
	}
}
