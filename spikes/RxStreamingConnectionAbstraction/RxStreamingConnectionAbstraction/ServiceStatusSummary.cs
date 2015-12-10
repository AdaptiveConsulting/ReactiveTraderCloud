namespace RxStreamingConnectionAbstraction
{
    public class ServiceStatusSummary
    {
        public ServiceStatusSummary(int serviceInstanceCount, bool isConnected)
        {
            ServiceInstanceCount = serviceInstanceCount;
            IsConnected = isConnected;
        }

        public int ServiceInstanceCount { get; set; }

        public bool IsConnected { get; set; }

        public override string ToString()
        {
            return $"ServiceInstanceCount: {ServiceInstanceCount}, IsConnected: {IsConnected}";
        }
    }
}