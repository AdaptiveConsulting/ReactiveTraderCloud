using Adaptive.ReactiveTrader.Client.Configuration;

namespace Adaptive.ReactiveTrader.Client.Android.Configuration
{
    internal sealed class ConfigurationProvider : IConfigurationProvider
    {
        public string[] Servers => new[] { "ws://web-demo.adaptivecluster.com:8080/ws" };
    }
}
