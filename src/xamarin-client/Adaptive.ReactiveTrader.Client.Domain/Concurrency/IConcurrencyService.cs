using System.Reactive.Concurrency;

namespace Adaptive.ReactiveTrader.Client.Domain.Concurrency
{
    internal interface IConcurrencyService
    {
         IScheduler TaskPool { get; }
    }
}