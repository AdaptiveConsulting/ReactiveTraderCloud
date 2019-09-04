namespace Adaptive.ReactiveTrader.Server.Pricing
{
  public class CurrencyPair
  {
    public CurrencyPair(string baseCcy, string quoteCcy)
    {
      BaseCcy = baseCcy;
      QuoteCcy = quoteCcy;
    }

    public CurrencyPair(string symbol) : this(symbol.Substring(0, 3), symbol.Substring(3, 3)) { }

    public string BaseCcy { get; }
    public string QuoteCcy { get; }

    public string Symbol => BaseCcy + QuoteCcy;
    public string ReciprocalSymbol => QuoteCcy + BaseCcy;

    public bool IsReciprocalOf(CurrencyPair other) => ReciprocalSymbol == other.Symbol;
    public override string ToString() => Symbol;

  }
}
