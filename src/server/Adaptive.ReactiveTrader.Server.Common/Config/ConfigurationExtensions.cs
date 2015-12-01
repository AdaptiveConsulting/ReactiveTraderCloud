using System;
using System.Collections.Generic;
using Microsoft.Framework.Configuration;

namespace Adaptive.ReactiveTrader.Server.Common.Config
{
    public static class ConfigurationExtensions
    {
        public static string GetStringValue(this IConfiguration config, string key, string defaultValue = null)
        {
            GuardConfigNotNull(config);

            var value = config[key];
            return string.IsNullOrEmpty(value) ? defaultValue : value;
        }

        public static int GetIntValue(this IConfiguration config, string key, int defaultValue = int.MinValue)
        {
            GuardConfigNotNull(config);

            var value = config[key];

            int intValue;
            if (string.IsNullOrEmpty(value) || !int.TryParse(value, out intValue))
            {
                return defaultValue;
            }

            return intValue;
        }

        public static IEnumerable<KeyValuePair<string, string>> EnumerateEntries(this IConfiguration config)
        {
            GuardConfigNotNull(config);

            return EnumerateEntriesImpl(config);
        }

        private static IEnumerable<KeyValuePair<string, string>> EnumerateEntriesImpl(this IConfiguration config)
        {
            foreach (var child in config.GetChildren())
            {
                if (child.Value == null)
                {
                    foreach (var descendent in EnumerateEntries(child))
                    {
                        yield return descendent;
                    }
                }
                else
                {
                    yield return new KeyValuePair<string, string>(child.Path, child.Value);
                }
            }
        }

        private static void GuardConfigNotNull(IConfiguration config)
        {
            if (config == null)
            {
                throw new ArgumentNullException(nameof(config));
            }
        }
    }
}