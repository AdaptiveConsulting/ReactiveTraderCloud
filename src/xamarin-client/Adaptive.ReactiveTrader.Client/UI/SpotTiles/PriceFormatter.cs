using System.Globalization;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    public static class PriceFormatter
    {
        public static FormattedPrice GetFormattedPrice(decimal rate, int precision, int pipsPosition)
        {
            var rateAsString = rate.ToString("0." + new string('0', precision), CultureInfo.InvariantCulture);

            var dotIndex = rateAsString.IndexOf('.');

            var bigFigures = rateAsString.Substring(0, dotIndex + pipsPosition - 1);
            var pips = rateAsString.Substring(dotIndex + pipsPosition - 1, 2);

            var tenthOfPips = "";

            if (precision > pipsPosition)
            {
                tenthOfPips = rateAsString.Substring(dotIndex + pipsPosition + 1, rateAsString.Length - (dotIndex + pipsPosition + 1));
            }

            return new FormattedPrice(bigFigures, pips, tenthOfPips);
        }

        public static string GetFormattedSpread(decimal spread, int precision, int pipsPosition)
        {
            var delta = precision - pipsPosition;
            if (delta > 0)
            {
                return spread.ToString("0." + new string('0', delta), CultureInfo.InvariantCulture);
            }
            return spread.ToString("0");
        }
    }

    public static class PriceFormatterExtention
    {
        public static FormattedPrice ToBidPrice(this IPrice price)
        {
            return PriceFormatter.GetFormattedPrice(
                price.Bid.Rate,
                price.CurrencyPair.RatePrecision,
                price.CurrencyPair.PipsPosition);
        }

        public static FormattedPrice ToAskPrice(this IPrice price)
        {
            return PriceFormatter.GetFormattedPrice(
                price.Ask.Rate,
                price.CurrencyPair.RatePrecision,
                price.CurrencyPair.PipsPosition);
        }
    }

}