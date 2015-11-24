using System;

namespace Adaptive.ReactiveTrader.MessageBroker
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            using (MessageBrokerLauncher.Run())
            {
                Console.WriteLine("Press any key...");
                Console.ReadLine();
            }
        }
    }
}