using System;

namespace Adaptive.ReactiveTrader.Client.Concurrency
{
    public interface IConstantRateConfigurationProvider
    {
        TimeSpan ConstantRate { get; }
    }
}