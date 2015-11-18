using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Transport;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Pricing Server starting...");

            Run().Wait();

            Console.ReadLine();
        }

        private static async Task Run()
        {
            const string uri = "ws://127.0.0.1:8080/ws";
            const string realm = "com.weareadaptive.reactivetrader";

            var channel = await BrokerFactory.Create(uri, realm);
            
        }
    }
}