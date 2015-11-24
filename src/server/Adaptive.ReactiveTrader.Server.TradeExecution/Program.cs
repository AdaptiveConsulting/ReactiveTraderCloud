using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.Messaging;
using System;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class Program
    {
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
                var broker = BrokerFactory.Create(uri, realm).Result;

                var es = new NetworkEventStore();
                es.Connect().Wait();

                using (TradeExecutionLauncher.Run(es, broker))
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
    }
}
