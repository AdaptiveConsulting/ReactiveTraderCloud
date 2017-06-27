using System;

namespace Adaptive.ReactiveTrader.Client.Domain.Instrumentation
{
    public class NullProcessorMonitor : IProcessorMonitor
    {
        public TimeSpan CalculateProcessingAndReset()
        {
            throw new InvalidOperationException("Can not calculate processing time on this platform.");
        }

        public bool IsAvailable => false;
    }
}