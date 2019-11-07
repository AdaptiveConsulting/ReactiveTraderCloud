using Adaptive.ReactiveTrader.Server.Host;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new BlotterServiceHostFactory());
        }
    }
}
