using System;

namespace Adaptive.ReactiveTrader.Shared.Logging
{
    public interface ILoggerFactory
    {
        ILog Create(Type type);
    }
}