using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using System;
using System.Reactive.Threading.Tasks;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class Program
    {
        private static TradeExecutionEngine _executionEngine;
        protected static readonly ILog Log = LogManager.GetLogger<Program>();
        private static TradeExecutionService _service;
        private static TradeExecutionServiceHost _serviceHost;
        private static IBroker _channel;

        public async Task Main(string[] args)
        {
            var uri = "ws://127.0.0.1:8080/ws";
            var realm = "com.weareadaptive.reactivetrader";

            if (args.Length > 0)
            {
                uri = args[0];
                if (args.Length > 1)
                    realm = args[1];
            }

            try
            {
                using (Run(uri, realm).Result)
                {
                    Console.WriteLine("Press Any Key To Stop...");
                    Console.ReadLine();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }

        private static async Task<IDisposable> Run(string uri, string realm)
        {
            Console.WriteLine("Trade Execution Service starting...");

            try
            {
                _executionEngine = new TradeExecutionEngine(new TradeIdProvider());

                _channel = await BrokerFactory.Create(uri, realm);
                _service = new TradeExecutionService(_executionEngine);
                _serviceHost = new TradeExecutionServiceHost(_service, _channel);

                await _serviceHost.Start();

                Console.WriteLine("Trade Execution Service Started.");
                Console.WriteLine("procedure Execute() registered");

                return _serviceHost;

            }
            catch (MessagingException e)
            {
                throw new Exception("Can't start service", e);
            }
        }
    }
}
