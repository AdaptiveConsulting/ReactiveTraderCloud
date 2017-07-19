using System;
using UIKit;
using Foundation;

namespace Adaptive.ReactiveTrader.Client.iOSTab
{
	public static class Styles
	{
		public static readonly UIColor RTLightBlue = UIColor.FromRGB (98, 127, 152);
		public static readonly UIColor RTFailRed = UIColor.FromRGB (192, 48, 0);
		public static readonly UIColor RTDarkBlue = UIColor.FromRGB (10, 15, 30);
		public static readonly UIColor RTDarkerBlue = UIColor.FromRGB (8, 11, 20);

		public static readonly UIColor RTTradeDisabled = UIColor.FromRGB (128, 64, 0); // Orange
		public static readonly UIColor RTTradeEnabled = UIColor.FromRGB (40, 112, 24); // Green


		//
		// Make all tables look the same...
		//
		// But is that desirable? TODO: UI workshop around presentation of eg trades blotter.
		//

		public static void ConfigureTable(UITableView uiTableView) {
			uiTableView.RowHeight = 176.0f;
			// Keep RowHeight ^^^^^^^ small enough to allow editing of notional when iOS tried to show the top edge of the containing table cell.
			uiTableView.AllowsSelection = false;
			uiTableView.SeparatorColor = Styles.RTLightBlue;
		}


		//
		// Format nicely, or 'vanilla' for ease of editing...
		//

		public static String FormatNotional (long notionalToFormat, bool niceFormatting)
		{
			if (niceFormatting) {
				return String.Format ("{0:#,##0}", notionalToFormat);
			} else {
				return notionalToFormat.ToString();
			}
		}

	}
}

