using System;

namespace Adaptive.ReactiveTrader.Client.Domain.Instrumentation
{
    public interface IProcessorMonitor
    {
        TimeSpan CalculateProcessingAndReset();
        bool IsAvailable { get; }
    }
}