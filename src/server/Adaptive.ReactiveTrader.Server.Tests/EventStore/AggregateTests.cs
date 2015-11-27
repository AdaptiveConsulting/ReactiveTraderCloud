using Adaptive.ReactiveTrader.EventStore.Domain;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.Tests.EventStore
{
    public class AggregateTests
    {
        [Fact]
        public void WhenCommandIsIssuedThenPendingEventIsCreated()
        {
            var aggregate = new TestAggregate();
            
            Assert.Equal(0, aggregate.GetPendingEvents().Count);
            
            aggregate.ChangeName("New Name");

            Assert.Equal(1, aggregate.GetPendingEvents().Count);
        }

        [Fact]
        public void WhenCommandIsIssuedThenVersionIsIncremented()
        {
            var aggregate = new TestAggregate();

            Assert.Equal(-1, aggregate.Version);

            aggregate.ChangeName("New Name");

            Assert.Equal(0, aggregate.Version);
        }

        [Fact]
        public void WhenCommandIsIssuedThenEventIsAppliedToAggregate()
        {
            var aggregate = new TestAggregate();

            aggregate.ChangeName("New Name");

            Assert.Equal("New Name", aggregate.Name);
        }
    }
}