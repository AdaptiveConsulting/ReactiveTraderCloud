namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public interface IPriceFeed
    {
        void Start();
        void SetUpdateFrequency(double value);
        double GetUpdateFrequency();
    }
}