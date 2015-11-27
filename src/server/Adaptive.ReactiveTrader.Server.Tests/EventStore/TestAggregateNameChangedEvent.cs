namespace Adaptive.ReactiveTrader.Server.Tests.EventStore
{
    public class TestAggregateNameChangedEvent
    {
        public string Name { get; }

        public TestAggregateNameChangedEvent(string name)
        {
            Name = name;
        }
    }
}