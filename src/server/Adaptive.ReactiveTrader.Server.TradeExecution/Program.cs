using Adaptive.ReactiveTrader.Server.Host;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new TradeExecutionServiceHostFactory());
        }
    }
}