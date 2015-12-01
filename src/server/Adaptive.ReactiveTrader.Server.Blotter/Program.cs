using Adaptive.ReactiveTrader.Server.Common;

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
