namespace RxStreamingConnectionAbstraction
{
    public class ServiceStatus
    {
        public static ServiceStatus CreateForConnected(string serviceType, string serviceId, int load)
        {
            return new ServiceStatus
            {
                ServiceType = serviceType,
                ServiceId = serviceId,
                Load = load,
                IsConnected = true
            };
        }

        public static ServiceStatus CreateForInstanceDisconnected(string serviceType, string serviceId)
        {
            return new ServiceStatus
            {
                ServiceType = serviceType,
                ServiceId = serviceId,
                IsConnected = false
            };
        }

        public static ServiceStatus CreateForConnectionLost(string serviceType)
        {
            return new ServiceStatus
            {
                ServiceType = serviceType,
                IsConnected = false
            };
        }

        //        private ServiceStatus(string serviceType, string serviceId)
        //        {
        //            ServiceType = serviceType;
        //            ServiceId = serviceId;
        //            IsConnected = false;
        //        }
        //
        //        public ServiceStatus(string serviceType, string serviceId, int load)
        //        {
        //            ServiceType = serviceType;
        //            ServiceId = serviceId;
        //            Load = load;
        //            IsConnected = true;
        //        }

        public ServiceStatus()
        {
            
        }

        public string ServiceType { get; private set; }
        public string ServiceId { get; private set; }
        public int? Load { get; private set; }
        public bool IsConnected { get; private set; }

        public override string ToString()
        {
            return $"ServiceId: {ServiceId}, Load: {Load}, IsConnected: {IsConnected}";
        }
    }
}