using Adaptive.ReactiveTrader.Client.Android.Concurrency;
using Adaptive.ReactiveTrader.Client.Android.Configuration;
using Adaptive.ReactiveTrader.Client.Concurrency;
using Adaptive.ReactiveTrader.Client.Configuration;
using Android.Content;
using Autofac;

namespace Adaptive.ReactiveTrader.Client.Android
{
    public class Bootstrapper : BootstrapperBase
    {
        private readonly AndroidUiScheduler _uiScheduler;

        public Bootstrapper(Context context)
        {
            _uiScheduler = new AndroidUiScheduler(context.MainLooper);
        }

        protected override void RegisterTypes(ContainerBuilder builder)
        {
            builder.RegisterType<ConfigurationProvider>().As<IConfigurationProvider>();
            builder.RegisterType<ConstantRateConfigurationProvider>().As<IConstantRateConfigurationProvider>();
            builder.RegisterType<UserProvider>().As<IUserProvider>().SingleInstance();
            builder.RegisterInstance(_uiScheduler);
            builder.RegisterType<ConcurrencyService>().As<IConcurrencyService>();
        }
    }
}