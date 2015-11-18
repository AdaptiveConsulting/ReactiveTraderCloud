using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReferenceDataRead
{
    public class Program
    {
        public void Main(string[] args)
        {
            var cache = new CurrencyPairCache();

            cache.Populate().Wait();

            var currencyPairs = cache.GetAll().ToList();

            Console.WriteLine("Press a key to exit");
            Console.ReadKey();
        }


    }
}
