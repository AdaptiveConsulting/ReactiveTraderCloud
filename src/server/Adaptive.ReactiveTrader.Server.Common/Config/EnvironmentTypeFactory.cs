using System;

namespace Adaptive.ReactiveTrader.Server.Common.Config
{
    internal static class EnvironmentTypeFactory
    {
        public static EnvironmentType FromArgs(string[] args)
        {
            var environmentType = EnvironmentType.Dev;

            if (args.Length <= 0)
            {
                return environmentType;
            }

            if (StringComparer.InvariantCultureIgnoreCase.Compare(args[0], "prod") == 0)
            {
                environmentType = EnvironmentType.Prod;
            }

            return environmentType;
        }
    }
}