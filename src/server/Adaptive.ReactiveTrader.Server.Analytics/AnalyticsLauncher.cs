using System;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Blotter;
using Common.Logging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsLauncher
    {
        private static readonly ILog Log = LogManager.GetLogger<AnalyticsLauncher>();

        public static async Task<IDisposable> Run(IEventStoreConnection es, IBroker broker)
        {
            Log.Info("Blotter Service starting...");
            try
            {
                var tradeCache = new TradeCache(es);
                var service = new AnalyticsService();
                var serviceHost = new AnalyticsServiceHost(service, es, broker, tradeCache);

                await serviceHost.Start();

                Log.Info("Service Started.");

                return new CompositeDisposable { serviceHost };
            }
            catch (MessagingException e)
            {
                throw new Exception("Can't start service", e);
            }
        }
    }
}