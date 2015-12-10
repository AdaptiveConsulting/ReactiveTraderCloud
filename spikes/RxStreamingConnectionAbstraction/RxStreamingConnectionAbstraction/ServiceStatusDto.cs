namespace RxStreamingConnectionAbstraction
{
    public class ServiceStatusDto
    {
        public ServiceStatusDto(string serviceType, string serviceId, int load)
        {
            ServiceType = serviceType;
            ServiceId = serviceId;
            Load = load;
        }

        public string ServiceType { get; set; }
        public string ServiceId { get; set; }
        public int Load { get; set; }
    }
}