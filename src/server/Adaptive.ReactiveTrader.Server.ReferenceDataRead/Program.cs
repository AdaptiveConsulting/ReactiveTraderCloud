using System;
using System.Linq;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class Program
    {
        public void Main(string[] args)
        {
            var cache = new CurrencyPairCache();
            
            cache.Populate().Wait();

            Console.WriteLine("Active Currency Pairs");

            foreach (var ccyPair in cache.GetAll().Where(x => x.IsEnabled))
            {
                Console.WriteLine($"Symbol: {ccyPair.Symbol}. Pips Position: {ccyPair.PipsPosition}. Rate Precision: {ccyPair.RatePrecision}. Sample Rate: {ccyPair.SampleRate}");
            }

            Console.WriteLine("Press a key to exit");
            Console.ReadKey();
        }
    }
}
