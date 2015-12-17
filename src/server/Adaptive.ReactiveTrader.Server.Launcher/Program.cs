using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Disposables;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common.Config;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Connection;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.MessageBroker;
using Adaptive.ReactiveTrader.Server.Analytics;
using Adaptive.ReactiveTrader.Server.Blotter;
using Adaptive.ReactiveTrader.Server.Core;
using Adaptive.ReactiveTrader.Server.Pricing;
using Adaptive.ReactiveTrader.Server.ReferenceDataRead;
using Adaptive.ReactiveTrader.Server.ReferenceDataWrite;
using Adaptive.ReactiveTrader.Server.TradeExecution;
using Common.Logging;
using Common.Logging.Simple;
using EventStore.ClientAPI;
using CurrencyPair = Adaptive.ReactiveTrader.Server.ReferenceDataWrite.Domain.CurrencyPair;

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public class Program
    {
        private static readonly Dictionary<string, IDisposable> Servers = new Dictionary<string, IDisposable>();

        private static readonly Dictionary<string, Lazy<IServiceHostFactory>> Factories =
            new Dictionary<string, Lazy<IServiceHostFactory>>();

        private static readonly ManualResetEvent CtrlC = new ManualResetEvent(false);

        public static ILog Log { get; set; }

        public static void StartService(string name, IServiceHostFactory factory)
        {
            var a = new App(new string[] {}, factory);

            Task.Run(() => a.Start());
            Servers.Add(name, Disposable.Create(() => a.Kill()));
        }

        private static IServiceHostFactory GetFactory(string type)
        {
            switch (type)
            {
                case "p":
                    return Factories["pricing"].Value;
                case "ref":
                case "r":
                    return Factories["reference-read"].Value;
                case "ref-write":
                    return Factories["reference-write"].Value;
                case "exec":
                case "e":
                    return Factories["execution"].Value;
                case "b":
                    return Factories["blotter"].Value;

                default:
                    return Factories[type].Value;
            }
        }

        public static void InitializeFactories()
        {
            Factories.Add("reference-read",
                          new Lazy<IServiceHostFactory>(() => new ReferenceDataReadServiceHostFactory()));
            Factories.Add("reference-write",
                          new Lazy<IServiceHostFactory>(() => new ReferenceDataWriteServiceHostFactory()));
            Factories.Add("pricing", new Lazy<IServiceHostFactory>(() => new PriceServiceHostFactory()));
            Factories.Add("blotter", new Lazy<IServiceHostFactory>(() => new BlotterServiceHostFactory()));
            Factories.Add("execution", new Lazy<IServiceHostFactory>(() => new TradeExecutionServiceHostFactory()));
            Factories.Add("analytics", new Lazy<IServiceHostFactory>(() => new AnalyticsServiceHostFactory()));
        }

        public static void Main(string[] args)
        {
            InitializeFactories();

            try
            {
                var signals = new WaitHandle[]
                {
#if __MonoCS__
                    new UnixSignal(Mono.Unix.Native.Signum.SIGTERM),
                    new UnixSignal(Mono.Unix.Native.Signum.SIGKILL),
#endif
                    CtrlC
                };


                Console.CancelKeyPress += (s, e) =>
                {
                    e.Cancel = true;
                    CtrlC.Set();
                };

                LogManager.Adapter = new ConsoleOutLoggerFactoryAdapter
                {
                    ShowLogName = true
                };

                Log = LogManager.GetLogger<Program>();

                // We should only be using the launcher during development, so hard code this to use the dev config
                var config = ServiceConfiguration.FromArgs(args.Where(a => a.Contains(".json")).ToArray());

                var eventStoreConnection = GetEventStoreConnection(config.EventStore);
                eventStoreConnection.ConnectAsync().Wait();

                var populate = args.Contains("init-es");

                if (populate || config.EventStore.Embedded)
                    ReferenceDataHelper.PopulateRefData(eventStoreConnection).Wait();

                var interactive = false;

                if (args.Contains("dev"))
                {
                    StartService("p1", GetFactory("pricing"));
                    StartService("r1", GetFactory("reference-read"));
                    StartService("e1", GetFactory("exec"));
                    StartService("b1", GetFactory("blotter"));
                    StartService("a1", GetFactory("analytics"));

                    interactive = true;
                }

                if (args.Contains("dev:with-broker"))
                {
                    Servers.Add("mb1", MessageBrokerLauncher.Run());
                    StartService("p1", GetFactory("pricing"));
                    StartService("r1", GetFactory("reference-read"));
                    StartService("e1", GetFactory("exec"));
                    StartService("b1", GetFactory("blotter"));
                    StartService("a1", GetFactory("analytics"));

                    interactive = true;
                }

                if (!args.Contains("--interactive") && !interactive)
                    while (true)
                        WaitHandle.WaitAny(signals);

                while (true)
                {
                    var x = Console.ReadLine();

                    try
                    {
                        if (x == null || x == "exit")
                            break;


                        if (x.StartsWith("start"))
                        {
                            var a = x.Split(' ');

                            var serviceType = a[1];
                            var serviceName = a[2];

                            if (Servers.ContainsKey(serviceName))
                            {
                                Console.WriteLine("Already got a {0}", serviceName);
                                continue;
                            }

                            StartService(serviceName, GetFactory(serviceType));

                            continue;
                        }

                        if (x.StartsWith("switch"))
                        {
                            var repository = new Repository(eventStoreConnection);

                            var a = x.Split(' ');

                            var ccyPair = a[1];

                            var currencyPair =
                                repository.GetById<CurrencyPair>(ccyPair).Result;

                            if (currencyPair.IsActive)
                            {
                                Console.WriteLine("** Deactivating {0}", ccyPair);
                                currencyPair.Deactivate();
                            }
                            else
                            {
                                Console.WriteLine("** Activating {0}", ccyPair);
                                currencyPair.Activate();
                            }

                            repository.SaveAsync(currencyPair).Wait();
                            continue;
                        }


                        if (x.StartsWith("kill"))
                        {
                            var a = x.Split(' ');

                            var serviceName = a[1];

                            Console.WriteLine("Killing service {0}", serviceName);
                            var server = Servers[serviceName];
                            Servers.Remove(serviceName);
                            server.Dispose();
                            continue;
                        }

                        if (x == "status")
                        {
                            Console.WriteLine("Running servers");
                            Console.WriteLine("===============");
                            foreach (var s in Servers.Keys)
                            {
                                Console.WriteLine("{0}", s);
                            }
                            continue;
                        }

                        if (x == "help")
                        {
                            Console.WriteLine("Available Commands");
                            Console.WriteLine("==================");
                            Console.WriteLine("start [r|p|e|b] [name]");
                            Console.WriteLine("kill [name]");
                            Console.WriteLine("status");
                            Console.WriteLine("help");
                            continue;
                        }

                        Console.WriteLine("Didn't understand command {0}", x);
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine("Error handling request");
                        Console.WriteLine(e);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                Console.ReadLine();
            }
        }

        private static IEventStoreConnection GetEventStoreConnection(IEventStoreConfiguration configuration)
        {
            var eventStoreConnection =
                EventStoreConnectionFactory.Create(
                    configuration.Embedded ? EventStoreLocation.Embedded : EventStoreLocation.External,
                    configuration);


            return eventStoreConnection;
        }
    }
}