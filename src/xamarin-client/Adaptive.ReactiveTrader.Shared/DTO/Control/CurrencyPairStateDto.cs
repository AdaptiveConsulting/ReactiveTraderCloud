namespace Adaptive.ReactiveTrader.Shared.DTO.Control
{
    public class CurrencyPairStateDto
    {
        public string Symbol { get; set; }
        public bool Enabled { get; set; }
        public bool Stale { get; set; }

        public override string ToString()
        {
            return string.Format("Symbol: {0}, Enabled: {1}, Stale: {2}", Symbol, Enabled, Stale);
        }
    }
}