using System;
using System.Reactive;
using System.Reactive.Linq;

namespace Adaptive.ReactiveTrader.Client.Concurrency
{
    public sealed class ConstantRatePump : IConstantRatePump
    {
        private readonly IObservable<Unit> _tick;
 
        public ConstantRatePump(IConcurrencyService concurrencyService, IConstantRateConfigurationProvider configurationProvider)
        {
            _tick = Observable.Timer(TimeSpan.Zero, configurationProvider.ConstantRate, concurrencyService.Dispatcher)
                              .Select(_ => Unit.Default)   // Use underscore (_) as a parameter name to indicate that it is ignored/not used
                              .Publish()
                              .RefCount();
        }
 
        public IObservable<Unit> Tick
        {
            get { return _tick; }
        }
    }
}