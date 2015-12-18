using Adaptive.ReactiveTrader.Server.Core;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new BlotterServiceHostFactory());
        }
    }
}