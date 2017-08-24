
using System;
using CoreGraphics;

using Foundation;
using UIKit;
using Adaptive.ReactiveTrader.Client.iOSTab.Tiles;
using Adaptive.ReactiveTrader.Client.iOSTab.Model;

namespace Adaptive.ReactiveTrader.Client.iOSTab.View
{
	public class TradesViewSource : UITableViewSource
	{
		private readonly TradeTilesModel _tradeTilesModel;

		public TradesViewSource (TradeTilesModel tradeTilesModel)
		{
			_tradeTilesModel = tradeTilesModel;
		}

		public override nint NumberOfSections (UITableView tableView)
		{
			return 1;
		}

		public override nfloat GetHeightForHeader (UITableView tableView, nint section)
		{
			// Crude fix for overlap with trades cells and phone status bar.
			return 20.0f;
		}

		public override nint RowsInSection (UITableView tableview, nint section)
		{
			return _tradeTilesModel.Count;
		}

		public override UITableViewCell GetCell (UITableView tableView, NSIndexPath indexPath)
		{
			var cell = tableView.DequeueReusableCell (PriceTileTradeAffirmationViewCell.Key) as PriceTileTradeAffirmationViewCell;
			if (cell == null)
				cell = PriceTileTradeAffirmationViewCell.Create ();

			var doneTrade = _tradeTilesModel [(int)indexPath.IndexAtPosition (1)];

			cell.UpdateFrom (doneTrade);

			return cell;
		}
		/*
		public override float GetHeightForRow (UITableView tableView, NSIndexPath indexPath)
		{
			// For now all rows are the same height, set via ConfigureTable.
		}*/
	}
}

