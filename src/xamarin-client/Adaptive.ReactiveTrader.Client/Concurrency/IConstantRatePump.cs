using System;
using System.Reactive;

namespace Adaptive.ReactiveTrader.Client.Concurrency
{
    public interface IConstantRatePump
    {
        IObservable<Unit> Tick { get; } 
    }
}