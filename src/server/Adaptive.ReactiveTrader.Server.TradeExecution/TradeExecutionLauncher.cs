using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.Messaging;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class TradeExecutionLauncher
    {
        public static async Task<IDisposable> Run(IEventStore eventStore, IBroker broker)
        {
            {
                Console.WriteLine("Trade Execution Service starting...");

                try
                {
                    var executionEngine = new TradeExecutionEngine(eventStore, new TradeIdProvider(eventStore));

                    var service = new TradeExecutionService(executionEngine);
                    var serviceHost = new TradeExecutionServiceHost(service, broker);

                    await serviceHost.Start();

                    Console.WriteLine("Trade Execution Service Started.");
                    Console.WriteLine("procedure Execute() registered");

                    return serviceHost;

                }
                catch (MessagingException e)
                {
                    throw new Exception("Can't start service", e);
                }
            }
        }
    }
}