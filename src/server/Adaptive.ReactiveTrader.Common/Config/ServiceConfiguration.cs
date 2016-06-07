using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.Configuration.Json;
using Serilog;
using Serilog.Events;

namespace Adaptive.ReactiveTrader.Common.Config
{
    public class ServiceConfiguration : IServiceConfiguration
    {
        private const string ConfigFolderName = "configs";
        //private static readonly ILogger Log = Log.ForContext<ServiceConfiguration>();

        private readonly IConfigurationRoot _config;

        private readonly string[] searchPaths =
        {
            Path.Combine(Directory.GetCurrentDirectory(), ConfigFolderName),
            Path.Combine(Directory.GetCurrentDirectory(), "..", ConfigFolderName)
        };

        private ServiceConfiguration(string[] args) : this(args.Any() ? args.First() : "config.dev.json")
        {
        }

        private ServiceConfiguration(string configFile)
        {
            var physicalLocation = searchPaths.Select(p => Path.Combine(p, configFile))
                                              .FirstOrDefault(File.Exists);

            if (physicalLocation == null) throw new FileNotFoundException("Cannot find file config", configFile);

            _config = new ConfigurationBuilder(new JsonConfigurationProvider(physicalLocation)).Build();

            Broker = new BrokerConfiguration(_config.GetSection("broker"));
            EventStore = new EventStoreConfiguration(_config.GetSection("eventStore"));
        }

        public IEventStoreConfiguration EventStore { get; }
        public IBrokerConfiguration Broker { get; }

        public static IServiceConfiguration FromArgs(string[] args)
        {
            var config = new ServiceConfiguration(args);

            if (Log.IsEnabled(LogEventLevel.Information))
            {
                Log.Information("Config build from command line args");
                Log.Information("Config Entries...");

                foreach (var entry in config.GetEntries())
                {
                    Log.Information(entry.ToString()); // TODO
                }
            }

            return config;
        }

        public IEnumerable<KeyValuePair<string, string>> GetEntries()
        {
            return _config.EnumerateEntries();
        }
    }
}