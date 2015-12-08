using System;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public static class TestConstants
    {
        public static readonly TimeSpan ResponseTimeout = TimeSpan.FromSeconds(10);
        public const string BrokerUrl = "ws://127.0.0.1:8080/ws";
    }
}