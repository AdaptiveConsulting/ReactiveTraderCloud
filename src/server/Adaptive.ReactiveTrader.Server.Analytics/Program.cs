using Adaptive.ReactiveTrader.Server.Core;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new AnalyticsServiceHostFactory());
        }
    }
}
