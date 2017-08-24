// WARNING
//
// This file has been generated automatically by Xamarin Studio to store outlets and
// actions made in the UI designer. If it is removed, they will be lost.
// Manual changes to this file may not be handled correctly.
//
using Foundation;
using System.CodeDom.Compiler;

namespace Adaptive.ReactiveTrader.Client.iOSTab.Tiles
{
	[Register ("PriceTileErrorViewCell")]
	partial class PriceTileErrorViewCell
	{
		[Outlet]
		UIKit.UILabel CurrencyPair { get; set; }
		
		void ReleaseDesignerOutlets ()
		{
			if (CurrencyPair != null) {
				CurrencyPair.Dispose ();
				CurrencyPair = null;
			}
		}
	}
}
