using Adaptive.ReactiveTrader.Server.Common;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new PriceServiceHostFactory());
        }
    }
}