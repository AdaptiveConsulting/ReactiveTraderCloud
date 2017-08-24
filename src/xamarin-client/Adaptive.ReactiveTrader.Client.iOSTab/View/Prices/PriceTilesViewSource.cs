using Foundation;
using UIKit;
using Adaptive.ReactiveTrader.Client.iOSTab.Tiles;
using System;


namespace Adaptive.ReactiveTrader.Client.iOSTab
{
	public class PriceTilesViewSource : UITableViewSource
	{
		private readonly PriceTilesModel priceTilesModel;

		public PriceTilesViewSource (PriceTilesModel priceTilesModel)
		{
			this.priceTilesModel = priceTilesModel;
		}


		public override nint NumberOfSections (UITableView tableView)
		{
			return 1;
		}


        public override nint RowsInSection (UITableView tableview, nint section)
		{
			return priceTilesModel.ActiveCurrencyPairs.Count;
		}


		public override nfloat GetHeightForHeader (UITableView tableView, nint section)
		{
			return 60.0f;
		}


		public override UIView GetViewForHeader (UITableView tableView, nint section)
		{
			// NOTE: Don't call the base implementation on a Model class
			// see http://docs.xamarin.com/guides/ios/application_fundamentals/delegates,_protocols,_and_events

            PricesHeaderCell dequeued = tableView.DequeueReusableHeaderFooterView (PricesHeaderCell.Key) as PricesHeaderCell;
			dequeued.UpdateFrom (UserModel.Instance);
            dequeued.Subviews[0].Frame = new CoreGraphics.CGRect(0, 0, tableView.Frame.Size.Width, 60f);
			return dequeued;
		}


		public override UITableViewCell GetCell (UITableView tableView, NSIndexPath indexPath)
		{
			PriceTileModel model = priceTilesModel [indexPath.Row];

			var cell = GetCell (tableView, model);

			cell.UpdateFrom (model);

			return ( UITableViewCell)cell;
		}


		private IPriceTileCell GetCell(UITableView tableView, PriceTileModel model) {
			IPriceTileCell priceTileCell = null;

			switch (model.Status) {
			case PriceTileStatus.Done:
			case PriceTileStatus.DoneStale:
				priceTileCell = tableView.DequeueReusableCell (PriceTileTradeAffirmationViewCell.Key) as PriceTileTradeAffirmationViewCell;
				if (priceTileCell == null) {
					priceTileCell = PriceTileTradeAffirmationViewCell.Create ();
				}
				break;

			case PriceTileStatus.Streaming:
			case PriceTileStatus.Executing:
				priceTileCell = tableView.DequeueReusableCell (PriceTileViewCell.Key) as PriceTileViewCell;
				if (priceTileCell == null) {
					priceTileCell = PriceTileViewCell.Create ();
				}
				break;

			case PriceTileStatus.Stale:
				priceTileCell = tableView.DequeueReusableCell (PriceTileErrorViewCell.Key) as PriceTileViewCell;
				if (priceTileCell == null) {
					priceTileCell = PriceTileErrorViewCell.Create ();
				}
				break;
			}

			return priceTileCell;
		}

		/*
		public override float GetHeightForRow (UITableView tableView, NSIndexPath indexPath)
		{
			// For now all rows are the same height, set via ConfigureTable.
		}*/
	}
}

