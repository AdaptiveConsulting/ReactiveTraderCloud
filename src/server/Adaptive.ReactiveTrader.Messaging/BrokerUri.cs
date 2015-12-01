using System;
using Adaptive.ReactiveTrader.Server.Common.Config;

namespace Adaptive.ReactiveTrader.Messaging
{
    public static class BrokerUri
    {
        public static string FromConfig(IBrokerConfiguration config)
        {
            var builder = new UriBuilder
            {
                Scheme = "ws",
                Path = "ws",
                Host = config.Host,
                Port = config.Port
            };

            return builder.ToString();
        }
    }
}