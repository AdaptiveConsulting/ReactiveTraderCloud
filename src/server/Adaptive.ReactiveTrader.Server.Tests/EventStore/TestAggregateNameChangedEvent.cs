namespace Adaptive.ReactiveTrader.Server.Tests.EventStore
{
    public class TestAggregateNameChangedEvent
    {
        public TestAggregateNameChangedEvent(string name)
        {
            Name = name;
        }

        public string Name { get; }
    }
}