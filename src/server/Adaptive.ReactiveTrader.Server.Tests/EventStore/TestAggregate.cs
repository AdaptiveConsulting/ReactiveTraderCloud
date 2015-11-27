using System;
using Adaptive.ReactiveTrader.EventStore.Domain;

namespace Adaptive.ReactiveTrader.Server.Tests.EventStore
{
    public class TestAggregate : AggregateBase
    {
        private readonly Guid _id;

        public TestAggregate()
        {
            _id = Guid.NewGuid();
        }

        public override object Identifier => $"testAggregate-{_id}";
        public string Name { get; private set; }

        public void ChangeName(string name)
        {
            RaiseEvent(new TestAggregateNameChangedEvent(name));
        }

        public void Apply(TestAggregateNameChangedEvent evt)
        {
            Name = evt.Name;
        }
    }
}