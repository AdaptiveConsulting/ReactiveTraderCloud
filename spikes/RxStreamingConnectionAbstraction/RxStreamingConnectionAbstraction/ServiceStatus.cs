namespace RxGroupBy
{
    public class ServiceStatus
    {
        public ServiceStatus(string serviceType, string serviceId)
        {
            ServiceType = serviceType;
            ServiceId = serviceId;
            IsConnected = false;
        }

        public ServiceStatus(string serviceType, string serviceId, int load)
        {
            ServiceType = serviceType;
            ServiceId = serviceId;
            Load = load;
            IsConnected = true;
        }

        public string ServiceType { get; set; }
        public string ServiceId { get; set; }
        public int? Load { get; set; }
        public bool IsConnected { get; set; }

        public override string ToString()
        {
            return $"ServiceId: {ServiceId}, Load: {Load}, IsConnected: {IsConnected}";
        }
    }
}