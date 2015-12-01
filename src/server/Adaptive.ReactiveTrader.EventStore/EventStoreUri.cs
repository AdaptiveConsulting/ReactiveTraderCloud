using System;
using Adaptive.ReactiveTrader.Server.Common.Config;

namespace Adaptive.ReactiveTrader.EventStore
{
    public static class EventStoreUri
    {
        public static readonly Uri Local = new Uri("tcp://admin:changeit@127.0.0.1:1113");

        public static Uri FromConfig(IEventStoreConfiguration config)
        {
            var builder = new UriBuilder
            {
                Scheme = "tcp",
                UserName = "admin",
                Password = "changeit",
                Host = config.Host,
                Port = config.Port
            };

            return builder.Uri;
        }
    }
}