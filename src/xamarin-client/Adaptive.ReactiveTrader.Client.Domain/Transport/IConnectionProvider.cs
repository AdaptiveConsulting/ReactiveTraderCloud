using System;

namespace Adaptive.ReactiveTrader.Client.Domain.Transport
{
    internal interface IConnectionProvider
    {
        IObservable<IConnection> GetActiveConnection();
    }
}