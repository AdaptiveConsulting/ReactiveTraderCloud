using System;
using System.Threading.Tasks;


namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class Program
    {
        public void Main(string[] args)
        {
            var cache = new CurrencyPairCache();

            cache.Initialize();

            Task.Delay(5000).Wait();

            cache.GetCurrencyPairUpdates()
                .Subscribe(WriteUpdateDto);

            Console.WriteLine("Press a key to exit");
            Console.ReadKey();
        }

        private void WriteUpdateDto(CurrencyPairUpdatesDto updatesDto)
        {
            Console.WriteLine("Received CurrencyPairUpdatesDto");

            foreach (var update in updatesDto.Updates)
            {
                Console.WriteLine($"Symbol: {update.CurrencyPair.Symbol}. Pips Position: {update.CurrencyPair.PipsPosition}. Rate Precision: {update.CurrencyPair.RatePrecision}. Type: {update.UpdateType}");
            }
        }
    }
}
