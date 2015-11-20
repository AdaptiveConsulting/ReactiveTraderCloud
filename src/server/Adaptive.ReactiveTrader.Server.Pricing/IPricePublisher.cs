using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public interface IPricePublisher
    {
        Task Publish(PriceDto price);
        long TotalPricesPublished { get; }
    }
}