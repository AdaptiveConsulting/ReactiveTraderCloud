using System.Collections.Generic;
using System.Linq;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Common.Config;

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public static class ArgumentParser
    {
        public static LauncherConfig GetLauncherConfig(string[] commandLineArgs)
        {
            var arguments = ExpandArgs(commandLineArgs);
            var configFile = ServiceConfiguration.FromArgs(arguments.Where(a => a.Contains(".json")).ToArray());

            var servicesToStart =
                arguments.Select(ServiceTypeHelper.GetServiceTypeFromString)
                    .Where(type => type != ServiceType.Unknown)
                    .ToList();

            var config = new LauncherConfig
            {
                Help = !arguments.Any() || arguments.Any(a => a.IsIn("--help", "/?", "-h", "-help")),
                IsInteractive = arguments.Any(a => a == "--interactive"),
                PopulateEventStore = arguments.Any(a => a.IsIn("--eventstore", "--populate-eventstore", "--init-es")),
                RunEmbeddedEventStore = arguments.Any(a => a == "--eventstore"),
                EventStoreParameters = configFile.EventStore,
                RunMessageBroker = arguments.Any(a => a == "--message-broker"),
                InvalidArguments = new List<string>(),
                ServicesToStart = servicesToStart,
            };

            return config;
        }

        private static List<string> ExpandArgs(IEnumerable<string> args)
        {
            string[] devArgs =
            {
                "pricing", "reference-read", "execution", "blotter", "analytics", "--interactive",
                "--eventstore", "--message-broker"
            };

            string[] allArgs =
            {
                "pricing", "reference-read", "execution", "blotter", "analytics"
            };

            var ret = new List<string>();

            foreach (var a in args)
            {
                var argument = a.ToLower();

                if (argument == "dev")
                    ret.AddRange(devArgs);
                if (argument == "all")
                    ret.AddRange(allArgs);
                else
                    ret.Add(argument);
            }
            return ret;
        }
    }
}