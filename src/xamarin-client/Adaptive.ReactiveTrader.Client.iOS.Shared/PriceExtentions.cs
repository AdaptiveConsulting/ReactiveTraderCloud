using Foundation;
using UIKit;
using Adaptive.ReactiveTrader.Client.UI.SpotTiles;

namespace Adaptive.ReactiveTrader.Client.iOS.Shared
{
    public static class FormattedPriceExtentions
    {
        public static NSAttributedString ToAttributedString(this FormattedPrice price)
        {
            var minorAttributes = new UIStringAttributes { ForegroundColor = UIColor.FromRGB(.7f, .7f, .7f), Font = UIFont.SystemFontOfSize(16), BaselineOffset = 1.5f };
            var majorAttributes = new UIStringAttributes { Font = UIFont.SystemFontOfSize(23) };

            var str = new NSMutableAttributedString(price.BigFigures, minorAttributes);
            str.Append(new NSAttributedString(price.Pips, majorAttributes));
            str.Append(new NSAttributedString(price.TenthOfPip, minorAttributes));

            return str;
        }

        public static NSAttributedString ToAttributedNotificationString(this FormattedPrice price)
        {
            var minorAttributes = new UIStringAttributes { ForegroundColor = UIColor.FromRGB(.7f, .7f, .7f), Font = UIFont.SystemFontOfSize(12), BaselineOffset = 1.5f };
            var majorAttributes = new UIStringAttributes { Font = UIFont.SystemFontOfSize(17) };

            var str = new NSMutableAttributedString(price.BigFigures, minorAttributes);
            str.Append(new NSAttributedString(price.Pips, majorAttributes));
            str.Append(new NSAttributedString(price.TenthOfPip, minorAttributes));

            return str;
        }

        public static string ToNormalString(this FormattedPrice price)
        {
            return $"{price.BigFigures}{price.Pips}{price.TenthOfPip}";
        }
    }
}
