using System;
using System.Collections.Generic;
using System.Reactive;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Shared.Extensions;
using Microsoft.Reactive.Testing;
using NUnit.Framework;

namespace Adaptive.ReactiveTrader.Tests.Shared.Extensions
{
    [TestFixture]
    public class HeartbeatTests
    {
        [Test]
        public void HeartbeatShouldBeInsertedOnSilentStreamPeriodically()
        {
            var testScheduler = new TestScheduler();
            var heartbeatPeriod = TimeSpan.FromTicks(10);
            var results = new List<Timestamped<IHeartbeat<int>>>();

            Observable.Never<int>()
                .Heartbeat(heartbeatPeriod, testScheduler)
                .Timestamp(testScheduler)
                .Subscribe(results.Add);

            testScheduler.AdvanceBy(25);

            Assert.AreEqual(2, results.Count);
            Assert.AreEqual(10, results[0].Timestamp.Ticks);
            Assert.AreEqual(20, results[1].Timestamp.Ticks);
        }

        [Test]
        public void AfterAnUpdateTheFirstHeartbeatShouldHappenAfterHeartbeatPeriod()
        {
            var testScheduler = new TestScheduler();
            var heartbeatPeriod = TimeSpan.FromTicks(10);
            var results = new List<Timestamped<IHeartbeat<long>>>();

            Observable.Timer(TimeSpan.FromTicks(5), testScheduler).Concat(Observable.Never<long>())
                .Heartbeat(heartbeatPeriod, testScheduler)
                .Timestamp(testScheduler)
                .Subscribe(results.Add);

            testScheduler.AdvanceBy(20);

            Assert.AreEqual(2, results.Count);

            Assert.AreEqual(false, results[0].Value.IsHeartbeat, "First update should not be a heartbeat");
            Assert.AreEqual(5, results[0].Timestamp.Ticks, "First update should not be delayed");

            Assert.AreEqual(true, results[1].Value.IsHeartbeat, "Second update should be a heartbeat");
            Assert.AreEqual(15, results[1].Timestamp.Ticks, "Second update should happen after first update + heartbeat period");
        }
    }
}