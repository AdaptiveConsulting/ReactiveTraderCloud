namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public static class ServiceTypeHelper
    {
        public static ServiceType GetServiceTypeFromString(string serviceType)
        {
            switch (serviceType)
            {
                case "p":
                case "pricing":
                    return ServiceType.Pricing;

                case "ref":
                case "r":
                case "reference-read":
                case "reference":
                    return ServiceType.Reference;

                case "exec":
                case "e":
                case "execution":
                    return ServiceType.Execution;
                case "b":
                case "blotter":
                    return ServiceType.Blotter;

                case "a":
                case "analytics":
                    return ServiceType.Analytics;
            }

            return ServiceType.Unknown;
        }

        public static bool IsValid(string serviceType)
        {
            return GetServiceTypeFromString(serviceType) != ServiceType.Unknown;
        }
    }
}