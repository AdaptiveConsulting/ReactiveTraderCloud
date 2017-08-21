namespace Adaptive.ReactiveTrader.Shared.DTO.Control
{
    public class FeedThroughputDto
    {
        public double Throughput { get; set; }

        public override string ToString()
        {
            return string.Format("Throughput: {0}", Throughput);
        }
    }
}