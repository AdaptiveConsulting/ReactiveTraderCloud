using System;
using System.Collections.Generic;
using System.Linq;
using Adaptive.ReactiveTrader.EventStore.Domain;
using EventStore.ClientAPI;
using EventStore.ClientAPI.SystemData;
using FakeItEasy;
using Xunit;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Tests.EventStore
{
    public class RepositoryTests
    {
        [Fact]
        public async void WhenAggregateIsSavedThenPendingEventsAreWritten()
        {
            var connection = A.Fake<IEventStoreConnection>();
            var repository = new Repository(connection, new EventTypeResolver(ReflectionHelper.ContractsAssembly));

            var testAggregate = new TestAggregate();
            testAggregate.ChangeName("First Name");
            testAggregate.ChangeName("Second Name");

            await repository.SaveAsync(testAggregate);

            Func<IEnumerable<EventData>, bool> expectedEventData = data => data.Count(x => x.Type == "TestAggregateNameChangedEvent") == 2;

            A.CallTo(
                () =>
                    connection.AppendToStreamAsync(A<string>.That.IsEqualTo(testAggregate.Identifier.ToString()),
                                                   A<int>._,
                                                   A<IEnumerable<EventData>>.That.Matches(expectedEventData, "EventData Is Correct"),
                                                   A<UserCredentials>._)).MustHaveHappened(Repeated.Exactly.Once);
        }

        [Fact]
        public async void WhenAggregateIsSavedThenPendingEventsAreClearedFromAggregate()
        {
            var aggregate = new TestAggregate();
            aggregate.ChangeName("New Name");

            var connection = A.Fake<IEventStoreConnection>();
            var repository = new Repository(connection, new EventTypeResolver(ReflectionHelper.ContractsAssembly));

            await repository.SaveAsync(aggregate);

            Assert.Equal(0, aggregate.GetPendingEvents().Count);
        }
    }
}