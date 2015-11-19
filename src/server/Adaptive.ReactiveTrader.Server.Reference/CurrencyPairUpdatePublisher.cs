using System;
using System.Reactive.Subjects;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public class CurrencyPairUpdatePublisher : IObservable<CurrencyPairUpdateDto>
    {
        private readonly ISubject<CurrencyPairUpdateDto> _subject;

        public CurrencyPairUpdatePublisher()
        {
            _subject = new Subject<CurrencyPairUpdateDto>();
        }

        public IDisposable Subscribe(IObserver<CurrencyPairUpdateDto> observer)
        {
            return _subject.Subscribe(observer);
        }

        public Task AddCurrencyPair(CurrencyPairDto ccyPair)
        {
            var update = new CurrencyPairUpdateDto
            {
                CurrencyPair = ccyPair,
                UpdateType = UpdateTypeDto.Added
            };

            return Publish(update);
        }

        public Task RemoveCurrencyPair(CurrencyPairDto ccyPair)
        {
            var update = new CurrencyPairUpdateDto
            {
                CurrencyPair = ccyPair,
                UpdateType = UpdateTypeDto.Removed
            };

            return Publish(update);
        }

        private async Task Publish(CurrencyPairUpdateDto update)
        {
            try
            {
                await Task.Run(() => _subject.OnNext(update));

                Console.WriteLine("Published currency pair update: {0}", update);
            }
            catch (Exception e)
            {
                Console.WriteLine($"An error occurred while publishing currency pair update: {update}", e);
            }
        }
    }
}