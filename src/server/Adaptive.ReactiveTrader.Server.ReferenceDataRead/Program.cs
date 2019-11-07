using Adaptive.ReactiveTrader.Server.Host;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new ReferenceDataReadServiceHostFactory());
        }
    }
}
