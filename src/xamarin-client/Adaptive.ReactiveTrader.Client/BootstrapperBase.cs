using Adaptive.ReactiveTrader.Client.Concurrency;
using Adaptive.ReactiveTrader.Client.Domain;
using Adaptive.ReactiveTrader.Client.Domain.Instrumentation;
using Adaptive.ReactiveTrader.Client.UI.Blotter;
using Adaptive.ReactiveTrader.Client.UI.Connectivity;
using Adaptive.ReactiveTrader.Client.UI.Shell;
using Adaptive.ReactiveTrader.Client.UI.SpotTiles;
using Adaptive.ReactiveTrader.Shared.Logging;
using Autofac;

namespace Adaptive.ReactiveTrader.Client
{
    public abstract class BootstrapperBase
    {
        public IContainer Build()
        {
            var builder = new ContainerBuilder();

            builder.RegisterType<Domain.ReactiveTrader>().As<IReactiveTrader>().SingleInstance();
            builder.RegisterType<DebugLoggerFactory>().As<ILoggerFactory>().SingleInstance();
            builder.RegisterType<NullProcessorMonitor>().As<IProcessorMonitor>().SingleInstance();
            builder.RegisterType<ConstantRatePump>().As<IConstantRatePump>();

            builder.RegisterType<ShellViewModel>().As<IShellViewModel>().ExternallyOwned();
            builder.RegisterType<SpotTilesViewModel>().As<ISpotTilesViewModel>().ExternallyOwned();
            builder.RegisterType<SpotTileViewModel>().As<ISpotTileViewModel>().ExternallyOwned();
            builder.RegisterType<SpotTileErrorViewModel>().As<ISpotTileErrorViewModel>().ExternallyOwned();
            builder.RegisterType<SpotTileConfigViewModel>().As<ISpotTileConfigViewModel>().ExternallyOwned();
            builder.RegisterType<SpotTilePricingViewModel>().As<ISpotTilePricingViewModel>().ExternallyOwned();
            builder.RegisterType<OneWayPriceViewModel>().As<IOneWayPriceViewModel>().ExternallyOwned();
            builder.RegisterType<SpotTileAffirmationViewModel>().As<ISpotTileAffirmationViewModel>().ExternallyOwned();
            builder.RegisterType<BlotterViewModel>().As<IBlotterViewModel>().ExternallyOwned();
            builder.RegisterType<TradeViewModel>().As<ITradeViewModel>().ExternallyOwned();
            builder.RegisterType<ConnectivityStatusViewModel>().As<IConnectivityStatusViewModel>().ExternallyOwned();

            RegisterTypes(builder);

            return builder.Build();
        }

        protected abstract void RegisterTypes(ContainerBuilder builder);
    }
}
