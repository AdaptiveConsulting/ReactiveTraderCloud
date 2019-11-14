using System;
using System.Threading;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Common.Config;
using Adaptive.ReactiveTrader.Messaging;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.Host
{
    public abstract class App
    {
        protected readonly ManualResetEvent Reset = new ManualResetEvent(false);

        public static void Run(string[] args, IServiceHostFactory factory)
        {
            var app = Create(args, factory);
            app.Start();
        }

        public static App Create(string[] args, IServiceHostFactory factory)
        {
            var config = ServiceConfiguration.FromArgs(args);
            switch (factory)
            {
                case IServiceHostFactoryWithBroker withBroker:
                    return new BrokerOnlyApp(config, withBroker);
                case IServiceHostFactoryWithEventStore withEventStore:
                    return new EventStoreApp(config, withEventStore);
                default:
                    throw new ArgumentException($"Unsupported service host factory type: '{factory.GetType().FullName}'", nameof(factory));
            }
        }

        public abstract void Start();

        public void Kill()
        {
            Reset.Set();
        }
    }

    public abstract class App<T>: App where T: IServiceHostFactory
    {
        protected readonly IServiceConfiguration Config;
        protected readonly T Factory;

        protected App(IServiceConfiguration config, T factory)
        {
            Config = config;
            Factory = factory;
        }

        public override void Start()
        {
            Console.CancelKeyPress += (sender, eventArgs) =>
            {
                eventArgs.Cancel = true;
                Reset.Set();
            };

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.ColoredConsole()
                .CreateLogger();

            try
            {
                using (var connectionFactory = BrokerConnectionFactory.Create(Config.Broker))
                {
                    var brokerStream = connectionFactory.GetBrokerStream();
                    using (InitializeFactory(brokerStream))
                    {
                        connectionFactory.Start();
                        Reset.WaitOne();
                    }
                }
            }
            catch (Exception e)
            {
                Log.Error(e, "Error connecting to broker");
            }
        }

        protected abstract IDisposable InitializeFactory(IObservable<IConnected<IBroker>> brokerStream);
    }
}
