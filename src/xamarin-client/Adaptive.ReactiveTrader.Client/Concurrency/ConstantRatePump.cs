using System;
using System.Reactive;
using System.Reactive.Linq;

namespace Adaptive.ReactiveTrader.Client.Concurrency
{
    public sealed class ConstantRatePump : IConstantRatePump
    {
        public ConstantRatePump(IConcurrencyService concurrencyService, IConstantRateConfigurationProvider configurationProvider)
        {
            Tick = Observable.Timer(TimeSpan.Zero, configurationProvider.ConstantRate, concurrencyService.Dispatcher)
                              .Select(_ => Unit.Default)   // Use underscore (_) as a parameter name to indicate that it is ignored/not used
                              .Publish()
                              .RefCount();
        }
 
        public IObservable<Unit> Tick { get; }
    }
}