using Foundation;
using UIKit;
using Adaptive.ReactiveTrader.Client.UI.SpotTiles;
using System.Collections.Generic;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;

namespace Adaptive.ReactiveTrader.Client.iOS.Shared
{

    public static class PriceMovementExtentions
    {
        readonly static UIFont _arrowFont = UIFont.SystemFontOfSize(20);

        public static NSAttributedString ToAttributedString(this PriceMovement priceMovement, IPrice price)
        {
            if (price == null)
            {
                return new NSAttributedString(string.Empty);
            }

            var movementText = new Dictionary<PriceMovement, NSAttributedString>
            {
                {PriceMovement.Up,   new NSAttributedString("▲", _arrowFont, UIColor.Green) },
                {PriceMovement.Down, new NSAttributedString("▼", _arrowFont, UIColor.Red) },
                {PriceMovement.None, new NSAttributedString("▼", _arrowFont, UIColor.Clear) }
            };


            var spread = new NSAttributedString(price.Spread.ToString("0.0") + "   ");
            var text = new NSMutableAttributedString(spread);
            text.Append(movementText[priceMovement]);
            return text;
        }

        public static NSAttributedString ToAttributedArrow(this PriceMovement priceMovement, IPrice price)
        {
            if (price == null)
            {
                return new NSAttributedString(string.Empty);
            }

            var movementText = new Dictionary<PriceMovement, NSAttributedString>
            {
                {PriceMovement.Up,   new NSAttributedString("▲", _arrowFont, UIColor.Green) },
                {PriceMovement.Down, new NSAttributedString("▼", _arrowFont, UIColor.Red) },
                {PriceMovement.None, new NSAttributedString("▼", _arrowFont, UIColor.Clear) }
            };

            return movementText[priceMovement];
        }
    }
}
