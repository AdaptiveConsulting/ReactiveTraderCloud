namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    public class FormattedPrice
    {
        public FormattedPrice(string bigFigures, string pips, string tenthOfPip)
        {
            BigFigures = bigFigures;
            Pips = pips;
            TenthOfPip = tenthOfPip;
        }

        public string BigFigures { get; private set; }
        public string Pips { get; private set; }
        public string TenthOfPip { get; private set; }
    }
}