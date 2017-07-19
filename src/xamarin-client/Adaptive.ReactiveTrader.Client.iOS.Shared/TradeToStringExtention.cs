using System;
using UIKit;
using Foundation;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Client.Domain.Models;

namespace Adaptive.ReactiveTrader.Client.iOS.Shared
{
    public static class TradeToStringExtention
    {
        static readonly UIStringAttributes _grey = new UIStringAttributes { ForegroundColor = UIColor.LightGray };
        static readonly UIStringAttributes _normal = new UIStringAttributes();

        static readonly UIStringAttributes _smallGrey = new UIStringAttributes { ForegroundColor = UIColor.LightGray, Font = UIFont.SystemFontOfSize(10) };
        static readonly UIStringAttributes _small = new UIStringAttributes { Font = UIFont.SystemFontOfSize(10) };

        static readonly UIStringAttributes _rejected = new UIStringAttributes { ForegroundColor = UIColor.Red, Font = UIFont.BoldSystemFontOfSize(15) };
        static readonly UIStringAttributes _rejectedNormal = new UIStringAttributes { StrikethroughStyle = NSUnderlineStyle.Single };
        static readonly UIStringAttributes _rejectedGrey = new UIStringAttributes { ForegroundColor = _grey.ForegroundColor, StrikethroughStyle = NSUnderlineStyle.Single };
        static readonly UIStringAttributes _rejectedSmall = new UIStringAttributes { Font = _small.Font, StrikethroughStyle = NSUnderlineStyle.Single };
        static readonly UIStringAttributes _rejectedSmallGrey = new UIStringAttributes { ForegroundColor = _smallGrey.ForegroundColor, Font = _smallGrey.Font, StrikethroughStyle = NSUnderlineStyle.Single };

        public static NSAttributedString ToAttributedString(this ITrade trade)
        {
            var currency = trade.CurrencyPair.Replace(trade.DealtCurrency, "");
            var sold = trade.Direction == Direction.BUY ? "Bought" : "Sold";

            var text = new NSMutableAttributedString();
            bool successful = trade.TradeStatus == TradeStatus.Done;

            if (successful)
            {
                text.Append($"{sold} ", _grey);
            }
            else
            {                
                text.Append($"TRADE REJECTED ", _rejected);
            }

            var normal = successful ? _normal : _rejectedNormal;
            var grey = successful ? _grey : _rejectedGrey;
            var small = successful ? _small : _rejectedSmall;
            var smallGrey = successful ? _smallGrey : _rejectedSmallGrey;

            text.Append($"{trade.DealtCurrency} {trade.Notional:n0}", normal);
            text.Append("\n vs ", grey);
            text.Append(currency, normal);
            text.Append("\n at ", grey);
            text.Append(trade.SpotRate.ToString(), normal);
            text.Append("\n", normal);
            text.Append("\nTrade ID: ", smallGrey);
            text.Append(trade.TradeId.ToString(), small);
            return text;
        }

        public static NSAttributedString ToAttributedStringLine1(this ITrade trade)
        {
            var sold = trade.Direction == Direction.BUY ? "Bought" : "Sold";
            var text = new NSMutableAttributedString();

            text.Append($"{sold} ", _grey);
            text.Append($"{trade.DealtCurrency} {trade.Notional:n0}\n", _normal);
            return text;
        }

        public static NSAttributedString ToAttributedStringLine2(this ITrade trade)
        {
            var currency = trade.CurrencyPair.Replace(trade.DealtCurrency, ""); // Hack
            var text = new NSMutableAttributedString();

            text.Append("vs ", _grey);
            text.Append(currency, _normal);
            text.Append(" at ", _grey);
            text.Append(trade.SpotRate.ToString(), _normal);
            return text;
        }
    }

    static class NSMutableAttributedStringExtention
    {
        public static void Append(this NSMutableAttributedString attributedString, string str, UIStringAttributes attributes)
        {
            attributedString.Append(new NSAttributedString(str, attributes));
        }
    }
}

