using Adaptive.ReactiveTrader.Server.Host;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new ReferenceDataWriteServiceHostFactory());
        }
    }
}