using System;
using System.Threading;
using Adaptive.ReactiveTrader.Common.Config;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Connection;
using Adaptive.ReactiveTrader.Messaging;
using EventStore.ClientAPI;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.Host
{
    public class App
    {
        public const int ThreadSleep = 5000;
        //private static readonly ILogger Log = Log.ForContext<App>();
        private readonly string[] _args;
        private readonly IServiceHostFactory _factory;
        private readonly ManualResetEvent _reset = new ManualResetEvent(false);

        public App(string[] args, IServiceHostFactory factory)
        {
            _args = args;
            _factory = factory;
        }

        public static void Run(string[] args, IServiceHostFactory factory)
        {
            var a = new App(args, factory);
            a.Start();
        }

        public void Kill()
        {
            _reset.Set();
        }

        public void Start()
        {
            Console.CancelKeyPress += (sender, eventArgs) =>
            {
                eventArgs.Cancel = true;
                _reset.Set();
            };

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.ColoredConsole()
                .CreateLogger();

            var config = ServiceConfiguration.FromArgs(_args);

            try
            {
                using (var connectionFactory = BrokerConnectionFactory.Create(config.Broker))
                {
                    var brokerStream = connectionFactory.GetBrokerStream();


                    var esFactory = _factory as IServiceHostFactoryWithEventStore;

                    if (esFactory != null)
                    {
                        // TODO TIDY

                        var eventStoreConnection = GetEventStoreConnection(config.EventStore);
                        var mon = new ConnectionStatusMonitor(eventStoreConnection);
                        var esStream = mon.GetEventStoreConnectedStream(eventStoreConnection);
                        eventStoreConnection.ConnectAsync().Wait();

                        using (esFactory.Initialize(brokerStream, esStream))
                        {
                            connectionFactory.Start();

                            _reset.WaitOne();
                        }
                    }
                    else
                    {
                        using (_factory.Initialize(brokerStream))
                        {
                            connectionFactory.Start();
                            _reset.WaitOne();
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Log.Error(e, "Error connecting to broker");
            }
        }

        private static IEventStoreConnection GetEventStoreConnection(IEventStoreConfiguration configuration)
        {
            var eventStoreConnection =
                EventStoreConnectionFactory.Create(
                    EventStoreLocation.External,
                    configuration);


            return eventStoreConnection;
        }
    }
}