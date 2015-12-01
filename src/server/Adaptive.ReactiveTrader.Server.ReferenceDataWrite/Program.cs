using Common.Logging;
using Adaptive.ReactiveTrader.Server.Common;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class Program
    {
        protected static readonly ILog Log = LogManager.GetLogger<Program>();

        public void Main(string[] args)
        {
            App.Run(args, new ReferenceDataWriteServiceHostFactory());
        }
    }
}
