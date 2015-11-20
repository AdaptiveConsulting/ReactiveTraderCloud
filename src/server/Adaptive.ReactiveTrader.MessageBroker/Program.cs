using System;

namespace Adaptive.ReactiveTrader.MessageBroker
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Messagee Broker Starting...");

            using (var broker = new MessageBroker())
            {
                broker.Start();
                
                Console.WriteLine("Press any key...");
                Console.ReadLine();
            }
        }
    }
}