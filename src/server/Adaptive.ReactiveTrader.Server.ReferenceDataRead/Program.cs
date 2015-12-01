using Adaptive.ReactiveTrader.Server.Core;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new ReferenceDataReadServiceHostFactory());
        }
    }
}