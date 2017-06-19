using System.Reactive.Concurrency;
using Adaptive.ReactiveTrader.Client.Concurrency;

namespace Adaptive.ReactiveTrader.Client.Android.Concurrency
{
    public sealed class ConcurrencyService : IConcurrencyService
    {
        private readonly AndroidUiScheduler _androidUiScheduler;
        public IScheduler Dispatcher { get { return _androidUiScheduler; } }

        public IScheduler TaskPool
        {
            get { return TaskPoolScheduler.Default; }
        }

        public ConcurrencyService(AndroidUiScheduler androidUiScheduler)
        {
            _androidUiScheduler = androidUiScheduler;
        }
    }
}