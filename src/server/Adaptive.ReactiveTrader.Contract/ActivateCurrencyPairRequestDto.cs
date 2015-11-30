namespace Adaptive.ReactiveTrader.Contract
{
    public class ActivateCurrencyPairRequestDto
    {
         public string CurrencyPair { get; set; }
    }

    public class DeactivateCurrencyPairRequestDto
    {
        public string CurrencyPair { get; set; }
    }
}