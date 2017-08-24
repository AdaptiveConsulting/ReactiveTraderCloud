using System;
using System.Collections.Generic;
using System.Reactive;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Shared.Extensions;
using Microsoft.Reactive.Testing;
using NUnit.Framework;

namespace Adaptive.ReactiveTrader.Tests.Shared.Extensions
{
    public class DetectStaleTests
    {
        [Test]
        public void StaleShouldBeInsertedOnSilentStreamOnce()
        {
            var testScheduler = new TestScheduler();
            var stalenessPeriod = TimeSpan.FromTicks(10);
            var results = new List<Timestamped<IStale<int>>>();

            Observable.Never<int>()
                .DetectStale(stalenessPeriod, testScheduler)
                .Timestamp(testScheduler)
                .Subscribe(results.Add);

            testScheduler.AdvanceBy(25);

            Assert.AreEqual(1, results.Count);
            Assert.AreEqual(10, results[0].Timestamp.Ticks);
        }

        [Test]
        public void AfterAnUpdateStaleShouldHappenAfterPeriod()
        {
            var testScheduler = new TestScheduler();
            var stalenessPeriod = TimeSpan.FromTicks(10);
            var results = new List<Timestamped<IStale<long>>>();

            Observable.Timer(TimeSpan.FromTicks(5), testScheduler).Concat(Observable.Never<long>())
                .DetectStale(stalenessPeriod, testScheduler)
                .Timestamp(testScheduler)
                .Subscribe(results.Add);

            testScheduler.AdvanceBy(30);

            Assert.AreEqual(2, results.Count);

            Assert.IsFalse(results[0].Value.IsStale, "First update should not be a stale");
            Assert.AreEqual(5, results[0].Timestamp.Ticks, "First update should not be delayed");

            Assert.IsTrue(results[1].Value.IsStale, "Second update should be a stale");
            Assert.AreEqual(15, results[1].Timestamp.Ticks, "Second update should happen after first update + stale period");
        }

        [Test]
        public void DetectStaleDoesNotThrowOnSynchronousStreams()
        {
            var result = Observable.Return(1)
                    .DetectStale(TimeSpan.FromSeconds(1), new TestScheduler())
                    .Wait();

            Assert.AreEqual(1, result.Update);
        }
    }
}