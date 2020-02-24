using Adaptive.ReactiveTrader.Server.Host;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new PriceServiceHostFactory());
        }
    }
}
