using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Common.Logging;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.Configuration.Json;

namespace Adaptive.ReactiveTrader.Common.Config
{
    public class ServiceConfiguration : IServiceConfiguration
    {
        private static readonly ILog Log = LogManager.GetLogger<ServiceConfiguration>();

        private const string ConfigFolderName = "configs";

        public static IServiceConfiguration FromArgs(string[] args)
        {
            var config = new ServiceConfiguration(args);

            if (Log.IsInfoEnabled)
            {
                Log.Info("Config build from command line args");
                Log.Info("Config Entries...");

                foreach (var entry in config.GetEntries())
                {
                    Log.Info(entry);
                }
            }

            return config;
        }
        
        private readonly IConfigurationRoot _config;

        private ServiceConfiguration(string[] args) : this(args.Any() ? args.First() : "config.dev.json")
        {
        }

        private ServiceConfiguration(string configFile)
        {
            var physicalLocation = searchPaths.Select(p => Path.Combine(p, configFile))
                                              .FirstOrDefault(File.Exists);

            if( physicalLocation == null ) throw new FileNotFoundException("Cannon file config",configFile);

            _config = new ConfigurationBuilder(new JsonConfigurationProvider(physicalLocation)).Build();

            Broker = new BrokerConfiguration(_config.GetSection("broker"));
            EventStore = new EventStoreConfiguration(_config.GetSection("eventStore"));
        }

        public IEventStoreConfiguration EventStore { get; }
        public IBrokerConfiguration Broker { get; }

        public IEnumerable<KeyValuePair<string, string>> GetEntries()
        {
            return _config.EnumerateEntries();
        }

        private readonly string[] searchPaths = {
            Path.Combine(Environment.CurrentDirectory, ConfigFolderName),
            Path.Combine(Environment.CurrentDirectory, "..", ConfigFolderName)
        };
    }
}
