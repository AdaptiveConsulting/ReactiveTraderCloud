
using System;
using CoreGraphics;

using Foundation;
using UIKit;
using Adaptive.ReactiveTrader.Client.iOSTab.Model;
using Adaptive.ReactiveTrader.Client.Domain;
using Adaptive.ReactiveTrader.Client.Concurrency;

namespace Adaptive.ReactiveTrader.Client.iOSTab.View
{
	public class TradesViewController : UITableViewController
	{
		private readonly IReactiveTrader _reactiveTrader;
		private readonly IConcurrencyService _concurrencyService;
		private readonly TradeTilesModel _model;

		public TradesViewController (IReactiveTrader reactiveTrader, IConcurrencyService concurrencyService)
			: base (UITableViewStyle.Plain)
		{
			_reactiveTrader = reactiveTrader;
			_concurrencyService = concurrencyService;

			Title = "Trades";
			TabBarItem.Image = UIImage.FromBundle ("tab_trades");

			_model = new TradeTilesModel (_reactiveTrader, _concurrencyService);

			_model.DoneTrades.CollectionChanged += (sender, e) => {
				// todo - handle insertions/removals properly
				UITableView table = this.TableView;

				if (table != null) {
					if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add
						&& e.NewItems.Count == 1) {
						table.InsertRows (
							new [] {
								NSIndexPath.Create (0, e.NewStartingIndex)
							}, UITableViewRowAnimation.Top);
					} else {
						table.ReloadData ();
					}
				}
			};

			_model.Initialise ();
		}

		public override void DidReceiveMemoryWarning ()
		{
			// Releases the view if it doesn't have a superview.
			base.DidReceiveMemoryWarning ();
			
			// Release any cached data, images, etc that aren't in use.
		}

		public override void ViewDidLoad ()
		{
			base.ViewDidLoad ();
			
            TableView.RegisterNibForHeaderFooterViewReuse(UINib.FromName("PricesHeaderCell", null), PricesHeaderCell.Key);
			TableView.Source = new TradesViewSource (_model);

            var headerHeight = TableView.Source.GetHeightForHeader(TableView, 0);
            TableView.ScrollIndicatorInsets = new UIEdgeInsets(headerHeight, 0, 0, 0);
            TableView.IndicatorStyle = UIScrollViewIndicatorStyle.White;

			Styles.ConfigureTable (TableView);
		}


		// Workaround: Prevent UI from incorrectly extending under tab bar.

		public override UIRectEdge EdgesForExtendedLayout => (base.EdgesForExtendedLayout ^ UIRectEdge.Bottom);
	}
}

