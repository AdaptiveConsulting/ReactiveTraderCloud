using System;
using System.Linq;
using System.Reflection;
using System.Threading;
using Adaptive.ReactiveTrader.MessageBroker;
using Common.Logging;
using Common.Logging.Simple;

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public class Program
    {
        private readonly ManualResetEvent _terminationSignal = new ManualResetEvent(false);
        private readonly IServiceLauncher _launcher;
        private bool _running = true;
        private LauncherConfig _config;
        
        private static readonly ConsoleLogger Log = new ConsoleLogger();
        
        public Program(IServiceLauncher serviceLauncher)
        {
            _launcher = serviceLauncher;
        }

        public void Run(LauncherConfig config)
        {
            _config = config;

            if (_config.Help)
            {
                Usage();
                return;
            }

            Log.Error();
            Log.Error(@"______                _   _             _____             _           ");
            Log.Error(@"| ___ \              | | (_)           |_   _|           | |          ");
            Log.Error(@"| |_/ /___  __ _  ___| |_ ___   _____    | |_ __ __ _  __| | ___ _ __ ");
            Log.Error(@"|    // _ \/ _` |/ __| __| \ \ / / _ \   | | '__/ _` |/ _` |/ _ \ '__|");
            Log.Error(@"| |\ \  __/ (_| | (__| |_| |\ V /  __/   | | | | (_| | (_| |  __/ |   ");
            Log.Error(@"\_| \_\___|\__,_|\___|\__|_| \_/ \___|   \_/_|  \__,_|\__,_|\___|_|   ");
            Log.Error();
            
            try
            {
                Console.CancelKeyPress += (s, e) =>
                {
                    Log.Info("Termination signal sent.");

                    e.Cancel = true;
                    Stop();
                };

                LogManager.Adapter = new ConsoleOutLoggerFactoryAdapter
                {
                    ShowLogName = true
                };

                if (_config.PopulateEventStore)
                    _launcher.InitializeEventStore(_config.EventStoreParameters, _config.RunEmbeddedEventStore);

                if (_config.RunMessageBroker)
                {
                    MessageBrokerLauncher.Run();
                    Log.Info("Started Message Broker");
                }

                foreach (var service in _config.ServicesToStart)
                    ParseCommand($"start {service}");


                foreach (var unhandledCommand in _config.InvalidArguments)
                    Log.Error("Unrecognised Command:  {0}", unhandledCommand);


                if (!_config.IsInteractive)
                {
                    if (_launcher.GetRunningServices().Any())
                        _terminationSignal.WaitOne();

                    return;
                }

                Log.Info();
                Log.Info("INTERACTIVE MODE - type 'help' for help or 'exit' to EXIT");

                // interactive mode
                while (_running)
                {
                    var x = Console.ReadLine();

                    try
                    {
                        if (x == null || x == "exit" || x == "quit")
                            break;

                        if (ParseCommand(x)) continue;

                        if (x == "help" || x == "h" || x == "")
                        {
                        }
                        else
                            Log.Error("Didn't understand command {0}", x);


                        Console.WriteLine();
                        Console.WriteLine("Available Commands");
                        Console.WriteLine("==================");
                        Console.WriteLine("start");
                        Console.WriteLine("  p|pricing - launch a pricing service.");
                        Console.WriteLine("  r|reference - launch a reference service.");
                        Console.WriteLine("  b|blotter - launch a blotter service.");
                        Console.WriteLine("  e|execution - launch a trade execution service.");
                        Console.WriteLine("  a|analytics - launch an analytics service.");
                        Console.WriteLine("kill [name] - kills a service (use status to find names).");
                        Console.WriteLine("status - returns a list of running services.");
                        Console.WriteLine("help - show this page.");
                        Console.WriteLine("exit - close the launcher.");
                        Console.WriteLine();
                    }
                    catch (Exception e)
                    {
                        Log.Error("Error handling request " + e.Message);
                        
                    }
                }
            }
            catch (Exception e)
            {
                Log.Error("Exception: " + e.Message);
            }
        }

        public bool ParseCommand(string input)
        {
            var command = input.ToLower();

            if (command.StartsWith("start"))
            {
                var a = command.Split(' ');

                var serviceType = a[1];

                try
                {
                    var type = ServiceTypeHelper.GetServiceTypeFromString(serviceType);

                    if (type == ServiceType.Unknown)
                    {
                        Log.Error("Could not start service, unknown service type '{0}'", serviceType);
                        return false;
                    }

                    var name = _launcher.StartService(type);

                    Log.Info("Started {0} Service: {1}", type, name);
                }
                catch (Exception e)
                {
                    Log.Error("Could not start service: {0}", e.Message);
                }
                return true;
            }

            if (command.StartsWith("kill"))
            {
                var a = command.Split(' ');

                var serviceName = a[1];

                Log.Info("Killing service {0}...", serviceName);

                if (_launcher.KillService(serviceName))
                    Log.Info("Service Killed.");
                else
                    Log.Error("Service '{0}' does not exist.", serviceName);

                return true;
            }

            if (command == "status")
            {
                Log.Info("Running services");
                Log.Info("================");
                foreach (var s in _launcher.GetRunningServices())
                    Log.Info("{0}", s);

                return true;
            }

            return false;
        }


        public static void Main(string[] args)
        {
            var p = new Program(new ServiceLauncher());
            p.Run(ArgumentParser.GetLauncherConfig(args));
        }

        public void Stop()
        {
            _terminationSignal.Set();
            _running = false;
        }

        private static void Usage()
        {
            Console.WriteLine("Reactive Trader launcher v{0}", Assembly.GetAssembly(typeof(Program)).GetName().Version);
            Console.WriteLine();
            Console.WriteLine("usage dnx run [service] [options]");

            Console.WriteLine();
            Console.WriteLine("service:");
            Console.WriteLine("  p|pricing - launch a pricing service.");
            Console.WriteLine("  r|reference - launch a reference service.");
            Console.WriteLine("  b|blotter - launch a blotter service.");
            Console.WriteLine("  e|execution - launch a trade execution service.");
            Console.WriteLine("  a|analytics - launch an analytics service.");
            Console.WriteLine();
            Console.WriteLine("  all - launches all of the above.");
            Console.WriteLine("  dev - launches all of the above with an embedded eventstore & message broker in interactive mode.");

            Console.WriteLine();
            Console.WriteLine("options:");
            Console.WriteLine("  --interactive - launch in interactive mode");
            Console.WriteLine("  --message-broker - launch with message broker (use when crossbar.io isn't running)");
            Console.WriteLine("  --eventstore - launch with embedded event store");
            Console.WriteLine("  --populate-eventstore|--init-es - populate external event store");
            Console.WriteLine();
        }
    }
}