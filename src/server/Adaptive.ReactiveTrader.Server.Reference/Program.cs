using System;
using System.Linq;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.ReferenceData.Domain;
using Common.Logging;
using Microsoft.Framework.ConfigurationModel;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public class Program
    {
        protected static readonly ILog Log = LogManager.GetLogger<Program>();

        public static async Task Main(string[] args)
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
                await Run(uri, realm);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            Console.WriteLine("Press Any Key To Stop...");
            Console.ReadLine();
        }

        private static async Task Run(string uri, string realm)
        {
            Console.WriteLine("Reference Data Service starting...");

            var repository = new CurrencyPairRepository();

            try
            {
                var channel = await BrokerFactory.Create(uri, realm);
                var service = new ReferenceService(repository.GetCurrencyUpdateStream());
                var serviceHost = new ReferenceServiceHost(service, channel);

                await serviceHost.Start();
            }
            catch (MessagingException e)
            {
                Log.Error(e);
                Console.WriteLine("Exiting");
                return;
            }

            Console.WriteLine("Service Started.");
            Console.WriteLine("procedure GetCurrencyPairs() registered");

            var random = new Random();

            while (true)
            {
                var ccys = repository.GetAllCurrencyPairs().ToArray();
                var pair = random.Next(0, ccys.Length);

                var ccy = ccys[pair];

                ccy.Enabled = !ccy.Enabled;

                if (ccy.Enabled)
                    await repository.AddCurrencyPair(ccy.CurrencyPair);
                else
                    await repository.RemoveCurrencyPair(ccy.CurrencyPair);

                Console.WriteLine("published to 'reference.onCurrencyPairUpdate'");
                await Task.Delay(TimeSpan.FromSeconds(1));
            }
        }
    }
}