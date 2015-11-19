using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    internal class Program
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Pricing Server starting...");

            var uri = "ws://127.0.0.1:8080/ws";
            var realm = "com.weareadaptive.reactivetrader";

            if (args.Length > 0)
            {
                uri = args[0];
                if (args.Length > 1)
                    realm = args[1];
            }

            await Run(uri, realm);

            Console.WriteLine("Press Any Key To Stop...");
            Console.ReadLine();
        }

        private static async Task Run(string uri, string realm)
        {
            Console.WriteLine("Doing Nothing.");

            try
            {
                var channel = await BrokerFactory.Create(uri, realm);
            }
            catch (MessagingException e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}