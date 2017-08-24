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
	[Register ("NotificationController")]
	partial class NotificationController
	{
		[Outlet]
		WatchKit.WKInterfaceLabel _arrowLabel { get; set; }

		[Outlet]
		WatchKit.WKInterfaceLabel _buyPriceLabel { get; set; }

		[Outlet]
		WatchKit.WKInterfaceGroup _priceGroup { get; set; }

		[Outlet]
		WatchKit.WKInterfaceLabel _priceLabel { get; set; }

		[Outlet]
		WatchKit.WKInterfaceLabel _sellPriceLabel { get; set; }

		[Outlet]
		WatchKit.WKInterfaceLabel _tradeDetailsLabel1 { get; set; }

		[Outlet]
		WatchKit.WKInterfaceLabel _tradeDetailsLabel2 { get; set; }
		
		void ReleaseDesignerOutlets ()
		{
			if (_arrowLabel != null) {
				_arrowLabel.Dispose ();
				_arrowLabel = null;
			}

			if (_buyPriceLabel != null) {
				_buyPriceLabel.Dispose ();
				_buyPriceLabel = null;
			}

			if (_priceGroup != null) {
				_priceGroup.Dispose ();
				_priceGroup = null;
			}

			if (_priceLabel != null) {
				_priceLabel.Dispose ();
				_priceLabel = null;
			}

			if (_sellPriceLabel != null) {
				_sellPriceLabel.Dispose ();
				_sellPriceLabel = null;
			}

			if (_tradeDetailsLabel1 != null) {
				_tradeDetailsLabel1.Dispose ();
				_tradeDetailsLabel1 = null;
			}

			if (_tradeDetailsLabel2 != null) {
				_tradeDetailsLabel2.Dispose ();
				_tradeDetailsLabel2 = null;
			}
		}
	}
}
