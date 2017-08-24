
using System;
using CoreGraphics;

using Foundation;
using UIKit;
using Adaptive.ReactiveTrader.Client.iOSTab.Model;
using Adaptive.ReactiveTrader.Client.Domain.Models;

namespace Adaptive.ReactiveTrader.Client.iOSTab.Tiles
{
	public partial class PriceTileTradeAffirmationViewCell : UITableViewCell, IPriceTileCell, ITradeDoneCell
	{
		public static readonly UINib Nib = UINib.FromName ("PriceTileTradeAffirmationViewCell", NSBundle.MainBundle);
		public static readonly NSString Key = new NSString ("PriceTileTradeAffirmationViewCell");

		PriceTileModel _priceTileModel;

		public PriceTileTradeAffirmationViewCell (IntPtr handle) : base (handle)
		{
		}

		public static PriceTileTradeAffirmationViewCell Create ()
		{
			PriceTileTradeAffirmationViewCell created = (PriceTileTradeAffirmationViewCell)Nib.Instantiate (null, null) [0];
			created.ContentView.BackgroundColor = Styles.RTDarkerBlue;
			return created;
		}

		partial void Done (NSObject sender)
		{
			var model = _priceTileModel;
			if (model != null) {
				model.Done();
			}
		}

		public void UpdateFrom (PriceTileModel model)
		{
			_priceTileModel = model;

			var tradeDone = model.TradeDone;
			if (tradeDone == null) {
				return;
			}

			UpdateFrom (tradeDone);

			DoneButton.Hidden = false;
		}

		public void UpdateFrom(TradeDoneModel model) {

			//
			// Currencies 'one, 'two' are always base, counter for the time being.
			// TODO: Understand when they might swap, eg if notional currency changed?
			//

			string currencyOne = "???";
			string currencyTwo = "???";
			string tradeStatus = "";

			UIStringAttributes strikethroughAttributes;

			switch (model.Trade.TradeStatus) {
			case Domain.Models.Execution.TradeStatus.Rejected:
				strikethroughAttributes = new UIStringAttributes {
					StrikethroughStyle = NSUnderlineStyle.Single
				};
				tradeStatus = "(REJECTED)";
				break;

			case Domain.Models.Execution.TradeStatus.Done:
			default:
				strikethroughAttributes = new UIStringAttributes {
					StrikethroughStyle = NSUnderlineStyle.None
				};
				break;
			}

			// Always displayed 'plain'...

			Direction.Text = model.Trade.Direction.ToString ();
			TradeId.Text = String.Format("{0} {1}", model.Trade.TradeId.ToString (), tradeStatus);

			// Displayed plain but needs some formatting to make nice...

			if (model.Trade.CurrencyPair.Length == 6) {
				currencyOne = model.Trade.CurrencyPair.Substring (0, 3);
				currencyTwo = model.Trade.CurrencyPair.Substring (3, 3);
				CurrencyPair.Text = String.Format("{0} / {1}", currencyOne, currencyTwo);
			} else {
				// We expect the currency pair to always be 3 + 3, but just in case...
				CurrencyPair.Text = model.Trade.CurrencyPair;
			}


			//			System.Console.WriteLine ("Trade details: {0}", model.Trade.ToString());

			// The following fields may be struck through in the event of trade failure...

			//
			// Note that we always use currencyTwo here for now...
			// This will be wrong when we allow notional to be in the counter currency.
			// TODO: Complete this implementation at that point. And work out what DealtCurrency means then.
			//

			CounterCCY.AttributedText = new NSAttributedString(currencyTwo, strikethroughAttributes);
			DirectionAmount.AttributedText = new NSAttributedString(Styles.FormatNotional(model.Trade.Notional, true), strikethroughAttributes);
			Rate.AttributedText = new NSAttributedString(model.Trade.SpotRate.ToString (), strikethroughAttributes);

			//
			// Note that 'Proper' trade dates (with spot date calculated with holidays etc taken into account).
			// TODO: Make sure we bind the correct date when it becomes available in future.
			//

			string valueDateFormatted = String.Format("SP. {0}", model.Trade.ValueDate.ToString ("dd MMM"));
			ValueDate.AttributedText = new NSAttributedString(valueDateFormatted, strikethroughAttributes);

			// We use some BOLD if the trader id matches the current user...

			UIStringAttributes maybeStrikeMaybeBold = new UIStringAttributes();
			maybeStrikeMaybeBold.StrikethroughStyle = strikethroughAttributes.StrikethroughStyle;
			if (model.Trade.TraderName == UserModel.Instance.TraderId) {
				maybeStrikeMaybeBold.Font = UIFont.BoldSystemFontOfSize(TraderId.Font.PointSize);
			}

			TraderId.AttributedText = new NSAttributedString(model.Trade.TraderName, maybeStrikeMaybeBold);

			//
			// Not directly available from ITrade, so we derive it thus?
			// At first was hardcoded 'EUR'!
			// So... using currencyOne is better but may not be right once UI and models allow notional currency to change.
			//
			// Maybe we'll end up with something akin to this...
			//			string directionCurrency = (model.Trade.Direction == Adaptive.ReactiveTrader.Client.Domain.Models.Direction.BUY) ? currencyOne : currencyTwo;
			//

			string directionCurrency = currencyOne;
			DirectionCCY.AttributedText = new NSAttributedString(directionCurrency, strikethroughAttributes);

			DoneButton.Hidden = true;

		}
	}
}

