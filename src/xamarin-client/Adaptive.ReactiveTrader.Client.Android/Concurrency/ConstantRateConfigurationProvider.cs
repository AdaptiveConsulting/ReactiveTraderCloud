using System;
using Adaptive.ReactiveTrader.Client.Concurrency;

namespace Adaptive.ReactiveTrader.Client.Android.Concurrency
{
    internal sealed class ConstantRateConfigurationProvider : IConstantRateConfigurationProvider
    {
        public TimeSpan ConstantRate => TimeSpan.FromSeconds(0.125);
    }
}