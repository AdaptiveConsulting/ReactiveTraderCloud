using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public class BlotterLauncher
    {
        private static readonly ILog Log = LogManager.GetLogger<BlotterLauncher>();

        public static async Task<IDisposable> Run(IEventStore es, IBroker broker)
        {
            Log.Info("Reference Data Service starting...");
            try
            {
                var cache = new TradeCache(es);
                cache.Initialize();

                var service = new BlotterService(cache.GetTrades());
                var serviceHost = new BlotterServiceHost(service, broker);

                await serviceHost.Start();

                Log.Info("Service Started.");
                
                return serviceHost;

            }
            catch (MessagingException e)
            {
                throw new Exception("Can't start service", e);
            }
        }
    }
}