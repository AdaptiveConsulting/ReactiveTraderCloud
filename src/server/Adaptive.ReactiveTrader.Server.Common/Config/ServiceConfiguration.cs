using Common.Logging;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.Configuration.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace Adaptive.ReactiveTrader.Server.Common.Config
{
    public interface IServiceConfiguration
    {
        IEventStoreConfiguration EventStore { get; }
        IBrokerConfiguration Broker { get; }
    }

    public class ServiceConfiguration : IServiceConfiguration
    {
        private static readonly ILog Log = LogManager.GetLogger<ServiceConfiguration>();

        private const string ConfigFolderName = "configs";
        private const string DevConfigName = @"config.dev.json";
        private const string ProdConfigName = @"config.prod.json";

        private static readonly string DevConfigLocation = Path.Combine(Environment.CurrentDirectory, ConfigFolderName, DevConfigName);
        private static readonly string ProdConfigLocation = Path.Combine(Environment.CurrentDirectory, ConfigFolderName, ProdConfigName);

        public static IServiceConfiguration FromArgs(string[] args)
        {
            var config = new ServiceConfiguration(args);

            if (Log.IsInfoEnabled)
            {
                Log.Info("Config build from command line args");
                Log.Info($"Environment Type: {config.EnvironmentType}");
                Log.Info("Config Entries...");

                foreach (var entry in config.GetEntries())
                {
                    Log.Info(entry);
                }
            }

            return config;
        }

        public static readonly IServiceConfiguration Dev = new ServiceConfiguration(EnvironmentType.Dev);
        public static readonly IServiceConfiguration Prod = new ServiceConfiguration(EnvironmentType.Prod);
        private readonly IConfigurationRoot _config;

        private ServiceConfiguration(string[] args) : this(EnvironmentTypeFactory.FromArgs(args))
        {
        }

        private ServiceConfiguration(EnvironmentType environmentType)
        {
            EnvironmentType = environmentType;
            _config = new ConfigurationBuilder(new JsonConfigurationProvider(environmentType == EnvironmentType.Dev ? DevConfigLocation : ProdConfigLocation)).Build();

            Broker = new BrokerConfiguration(_config.GetSection("broker"));
            EventStore = new EventStoreConfiguration(_config.GetSection("eventStore"));
        }

        public IEventStoreConfiguration EventStore { get; }
        public IBrokerConfiguration Broker { get; }
        public EnvironmentType EnvironmentType { get; }

        public IEnumerable<KeyValuePair<string, string>> GetEntries()
        {
            return _config.EnumerateEntries();
        }
    }
}
