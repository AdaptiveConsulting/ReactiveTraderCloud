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

namespace Adaptive.ReactiveTrader.Client.iOSTab
{
	[Register ("StartUpView")]
	partial class StartUpView
	{
		[Outlet]
		UIKit.UIActivityIndicatorView Activity { get; set; }

		[Outlet]
		UIKit.UILabel Connecting { get; set; }

		[Outlet]
		UIKit.UILabel ErrorLabel { get; set; }

		[Outlet]
		[GeneratedCode ("iOS Designer", "1.0")]
		UIButton RetryButton { get; set; }

		[Action ("RetryButton_TouchUpInside:")]
		[GeneratedCode ("iOS Designer", "1.0")]
		partial void RetryButton_TouchUpInside (UIButton sender);

		void ReleaseDesignerOutlets ()
		{
			if (Activity != null) {
				Activity.Dispose ();
				Activity = null;
			}
			if (Connecting != null) {
				Connecting.Dispose ();
				Connecting = null;
			}
			if (ErrorLabel != null) {
				ErrorLabel.Dispose ();
				ErrorLabel = null;
			}
			if (RetryButton != null) {
				RetryButton.Dispose ();
				RetryButton = null;
			}
		}
	}
}
