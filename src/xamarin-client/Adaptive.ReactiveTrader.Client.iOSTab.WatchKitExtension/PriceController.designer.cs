// WARNING
//
// This file has been generated automatically by Xamarin Studio to store outlets and
// actions made in the UI designer. If it is removed, they will be lost.
// Manual changes to this file may not be handled correctly.
//
using Foundation;
using System.CodeDom.Compiler;

namespace Adaptive.ReactiveTrader.Client.iOSTab.WatchKitExtension
{
	[Register ("PriceController")]
	partial class PriceController
	{
		[Outlet]
		WatchKit.WKInterfaceButton BuyButton { get; set; }

		[Outlet]
		WatchKit.WKInterfaceLabel BuyPriceLabel { get; set; }

		[Outlet]
		WatchKit.WKInterfaceLabel PriceLabel { get; set; }

		[Outlet]
		WatchKit.WKInterfaceButton SellButton { get; set; }

		[Outlet]
		WatchKit.WKInterfaceLabel SellPriceLabel { get; set; }

		[Action ("BuyButtonTapped")]
		partial void BuyButtonTapped ();

		[Action ("SellButtonTapped")]
		partial void SellButtonTapped ();
		
		void ReleaseDesignerOutlets ()
		{
			if (SellButton != null) {
				SellButton.Dispose ();
				SellButton = null;
			}

			if (BuyPriceLabel != null) {
				BuyPriceLabel.Dispose ();
				BuyPriceLabel = null;
			}

			if (SellPriceLabel != null) {
				SellPriceLabel.Dispose ();
				SellPriceLabel = null;
			}

			if (BuyButton != null) {
				BuyButton.Dispose ();
				BuyButton = null;
			}

			if (PriceLabel != null) {
				PriceLabel.Dispose ();
				PriceLabel = null;
			}
		}
	}
}
