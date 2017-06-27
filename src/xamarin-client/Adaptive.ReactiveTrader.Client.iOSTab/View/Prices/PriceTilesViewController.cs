using System;
using Foundation;
using UIKit;
using Adaptive.ReactiveTrader.Client.Domain;
using Adaptive.ReactiveTrader.Client.Concurrency;
using System.Linq;
using Adaptive.ReactiveTrader.Client.iOSTab.Tiles;

namespace Adaptive.ReactiveTrader.Client.iOSTab
{
	public partial class PriceTilesViewController : UITableViewController
	{
		private readonly IReactiveTrader _reactiveTrader;
		private readonly IConcurrencyService _concurrencyService;
		private readonly PriceTilesModel _model;

		public PriceTilesViewController (IReactiveTrader reactiveTrader, IConcurrencyService concurrencyService) 
			: base(UITableViewStyle.Plain)
		{
			this._concurrencyService = concurrencyService;
			this._reactiveTrader = reactiveTrader;

			Title = "Prices";
			TabBarItem.Image = UIImage.FromBundle ("tab_prices");

			_model = new PriceTilesModel (_reactiveTrader, _concurrencyService);

			_model.ActiveCurrencyPairs.CollectionChanged += (sender, e) => {
				foreach (var model in e.NewItems.Cast<PriceTileModel>()) {
					model.OnChanged
						.Subscribe (OnItemChanged);
				}
				if (IsViewLoaded) {
					TableView.ReloadData ();
				}
			};
			_model.Initialise ();

		}

		private void OnItemChanged(PriceTileModel itemModel)
        {

			if (IsViewLoaded) {
				var indexOfItem = _model.ActiveCurrencyPairs.IndexOf (itemModel);

				NSIndexPath path = NSIndexPath.FromRowSection(indexOfItem, 0);
				IPriceTileCell cell = (IPriceTileCell)TableView.CellAt (path);

				if (cell != null) {

					// TODO: Batch the updates up, to only call ReloadRows once per main event loop loop?

                    if (ShouldUpdateCell(itemModel.Status, cell)) {
						//						System.Console.WriteLine ("Cell is APPROPRIATE", indexOfItem);
						cell.UpdateFrom (itemModel);
					} else {
						TableView.ReloadRows (
							new [] {
								NSIndexPath.Create (0, indexOfItem)
							}, UITableViewRowAnimation.None);
					}
				}

			}
		}

        private static bool ShouldUpdateCell(PriceTileStatus status, IPriceTileCell cell)
        {
            switch (status) {
                case PriceTileStatus.Done:
                case PriceTileStatus.DoneStale:

                    if (cell is PriceTileTradeAffirmationViewCell) {
                        return true;
                    }

                    break;

                case PriceTileStatus.Streaming:
                case PriceTileStatus.Executing:

                    if (cell is PriceTileViewCell) {
                        return true;
                    }

                    break;

                case PriceTileStatus.Stale:

                    if (cell is PriceTileErrorViewCell) {
                        return true;
                    }

                    break;
            }

            return false;
        }

		public override void ViewDidLoad ()
		{
			base.ViewDidLoad ();

			TableView.RegisterNibForHeaderFooterViewReuse (PricesHeaderCell.Nib, PricesHeaderCell.Key);

			TableView.Source = new PriceTilesViewSource (_model);

            var headerHeight = TableView.Source.GetHeightForHeader(TableView, 0);
            TableView.ScrollIndicatorInsets = new UIEdgeInsets(headerHeight, 0, 0, 0);
            TableView.IndicatorStyle = UIScrollViewIndicatorStyle.White;

			Styles.ConfigureTable (TableView);
		}


		// Workaround: Prevent UI from incorrectly extending under tab bar.

		public override UIRectEdge EdgesForExtendedLayout => (base.EdgesForExtendedLayout ^ UIRectEdge.Bottom);
	}
}

