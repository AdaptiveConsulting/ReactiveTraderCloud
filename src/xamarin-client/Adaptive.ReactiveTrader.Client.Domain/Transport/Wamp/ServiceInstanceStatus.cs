namespace Adaptive.ReactiveTrader.Client.Domain.Transport.Wamp
{
    public class ServiceInstanceStatus
    {
        public static ServiceInstanceStatus CreateForConnected(string serviceType, string serviceId, double load)
        {
            return new ServiceInstanceStatus
            {
                ServiceType = serviceType,
                ServiceId = serviceId,
                Load = load,
                IsConnected = true
            };
        }

        public static ServiceInstanceStatus CreateForDisconnected(string serviceType, string serviceId)
        {
            return new ServiceInstanceStatus
            {
                ServiceType = serviceType,
                ServiceId = serviceId,
                IsConnected = false
            };
        }
        
        public string ServiceType { get; private set; }
        public string ServiceId { get; private set; }
        public double? Load { get; private set; }
        public bool IsConnected { get; private set; }

        public override string ToString()
        {
            return $"ServiceId: {ServiceId}, Load: {Load}, IsConnected: {IsConnected}";
        }
    }
}