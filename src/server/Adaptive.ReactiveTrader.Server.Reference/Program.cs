using System;
using System.Linq;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Transport;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Reference Data Service starting...");

            Run().Wait();

            Console.ReadLine();
        }

        private static async Task Run()
        {
            const string uri = "ws://127.0.0.1:8080/ws";
            const string realm = "com.weareadaptive.reactivetrader";

            var channel = await BrokerFactory.Create(uri, realm);

            var repository = new CurrencyPairRepository();
            var publisher = new CurrencyPairUpdatePublisher();
            var hub = new ReferenceDataHub(repository);

            var rr = new RequestStreamParadigm<CurrencyPairUpdateDto>(channel, () => hub.GetCurrencyPairs(), publisher);

            await channel.RegisterService(rr);

            Console.WriteLine("procedure GetCurrencyPairs() registered");

            var random = new Random();

            while (true)
            {
                var ccys = repository.GetAllCurrencyPairs().ToArray();
                var pair = random.Next(0, ccys.Length);

                var ccy = ccys[pair];

                ccy.Enabled = !ccy.Enabled;

                if (ccy.Enabled)
                    await publisher.AddCurrencyPair(ccy.CurrencyPair);
                else
                    await publisher.RemoveCurrencyPair(ccy.CurrencyPair);

                Console.WriteLine("published to 'reference.onCurrencyPairUpdate'");
                await Task.Delay(TimeSpan.FromSeconds(5));
            }
        }
    }
}