namespace Adaptive.ReactiveTrader.Client.Configuration
{
    public interface IConfigurationProvider
    {
        string[] Servers { get; }
    }
}