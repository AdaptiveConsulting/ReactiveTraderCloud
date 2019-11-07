using Adaptive.ReactiveTrader.Server.Host;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new ReferenceDataWriteServiceHostFactory());
        }
    }
}
