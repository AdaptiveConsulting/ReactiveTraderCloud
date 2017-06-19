namespace Adaptive.ReactiveTrader.Shared.DTO.Execution
{
    public class ExecuteTradeRequestDto
    {
        public string CurrencyPair { get; set; }
        public decimal SpotRate { get; set; }
        public string ValueDate { get; set; }
        public DirectionDto Direction { get; set; }
        public long Notional { get; set; }
        public string DealtCurrency { get; set; }

        public override string ToString()
        {
            return
                $"Symbol: {CurrencyPair}, SpotRate: {SpotRate}, ValueDate: {ValueDate}, Direction: {Direction}, Notional: {Notional}, DealtCurrency: {DealtCurrency}";
        }
    }
}