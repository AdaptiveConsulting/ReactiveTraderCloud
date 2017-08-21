using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;

namespace Adaptive.ReactiveTrader.Client.Domain.Instrumentation
{
    public interface IPriceLatencyRecorder
    {
        void OnRendered(IPrice price);
        void OnReceived(IPrice price);
        Statistics CalculateAndReset();
    }
}