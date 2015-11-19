using System;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.MessageBroker
{
    internal class Program
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Messagee Broker Starting...");

            var broker = new MessageBroker();
            broker.Start();
            Console.WriteLine("Press any key...");
            Console.ReadLine();
        }
    }
}