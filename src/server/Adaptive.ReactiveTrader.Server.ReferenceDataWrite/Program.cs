using Adaptive.ReactiveTrader.Server.Host;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class Program
    {
        protected static readonly ILog Log = LogManager.GetLogger<Program>();

        public static void Main(string[] args)
        {
            App.Run(args, new ReferenceDataWriteServiceHostFactory());
        }
    }
}