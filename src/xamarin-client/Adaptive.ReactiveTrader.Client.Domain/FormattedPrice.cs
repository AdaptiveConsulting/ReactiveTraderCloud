namespace Adaptive.ReactiveTrader.Client.Domain
{
	public class FormattedPrice
	{
		public FormattedPrice(string bigFigures, string pips, string tenthOfPip)
		{
			BigFigures = bigFigures;
			Pips = pips;
			TenthOfPip = tenthOfPip;
		}

		public string BigFigures { get; }
		public string Pips { get; }
		public string TenthOfPip { get; }
	}
}

