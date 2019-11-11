using Adaptive.ReactiveTrader.Server.Host;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new AnalyticsServiceHostFactory());
        }
    }
}
