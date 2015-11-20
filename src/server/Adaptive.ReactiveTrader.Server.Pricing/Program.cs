using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class Program
    {
        protected static readonly ILog Log = LogManager.GetLogger<Program>();
        private static PricingService _service;
        private static PricingServiceHost _serviceHost;
        private static IBroker _channel;
        private static PriceGenerator _cache;

        public static void Main(string[] args)
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
            Console.WriteLine("Pricing Data Service starting...");

            try
            {
                _cache = new PriceGenerator();

                _channel = await BrokerFactory.Create(uri, realm);
                _service = new PricingService(_cache.GetPriceStream);
                _serviceHost = new PricingServiceHost(_service, _channel);

                await _serviceHost.Start();

                Console.WriteLine("Service Started.");

                return _serviceHost;
            }
            catch (MessagingException e)
            {
                throw new Exception("Can't start service", e);
            }
        }
    }
}