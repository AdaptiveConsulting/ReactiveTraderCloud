using Adaptive.ReactiveTrader.EventStore;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class Program
    {
        public void Main(string[] args)
        {
            var memoryEventStore = new NetworkEventStore();
            ReferenceDataWriterLauncher.Run(memoryEventStore).RunSynchronously();
        }
    }
}