using Adaptive.ReactiveTrader.Server.Host;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new TradeExecutionServiceHostFactory());
        }
    }
}
