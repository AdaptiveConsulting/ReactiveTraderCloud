using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.ReferenceData;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class Program
    {
        protected static readonly ILog Log = LogManager.GetLogger<Program>();
        private static ReferenceService _service;
        private static ReferenceServiceHost _serviceHost;
        private static IBroker _channel;
        private static CurrencyPairCache _cache;

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
            Console.WriteLine("Reference Data Service starting...");

            try
            {
                _cache = new CurrencyPairCache();
                _cache.Initialize();

                _channel = await BrokerFactory.Create(uri, realm);
                _service = new ReferenceService(_cache.GetCurrencyPairUpdates());
                _serviceHost = new ReferenceServiceHost(_service, _channel);

                await _serviceHost.Start();

                Console.WriteLine("Service Started.");
                Console.WriteLine("procedure GetCurrencyPairs() registered");
                
                return _serviceHost;

            }
            catch (MessagingException e)
            {
                throw new Exception("Can't start service", e);
            }
        }

        private void WriteUpdateDto(CurrencyPairUpdatesDto updatesDto)
        {
            Console.WriteLine("Received CurrencyPairUpdatesDto");

            foreach (var update in updatesDto.Updates)
            {
                Console.WriteLine(
                    $"Symbol: {update.CurrencyPair.Symbol}. Pips Position: {update.CurrencyPair.PipsPosition}. Rate Precision: {update.CurrencyPair.RatePrecision}. Type: {update.UpdateType}");
            }
        }
    }
}