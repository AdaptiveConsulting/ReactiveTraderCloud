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
    public class ConflateTests
    {
        private readonly TimeSpan _minimumUpdatePeriod = TimeSpan.FromSeconds(1);

        private TestScheduler _testScheduler;
        private long _startTicks;

        [SetUp]
        public void SetUp()
        {
            _testScheduler = new TestScheduler();
            _startTicks = DateTime.UtcNow.Date.Ticks;
            _testScheduler.AdvanceTo(_startTicks);
        }

        [Test]
        public void SingleUpdateShouldBeScheduledImmediatly()
        {
            var conflatedTimestamps = new List<long>();
            Observable
                .Return(1)
                .Conflate(_minimumUpdatePeriod, _testScheduler)
                .Subscribe(x => conflatedTimestamps.Add(_testScheduler.Now.Ticks));

            _testScheduler.Start();

            Assert.AreEqual(1, conflatedTimestamps.Count);
            Assert.AreEqual(_startTicks + 1, conflatedTimestamps[0]);
        }

        [Test]
        public void ConflateShouldDelaySecondUpdateIfBelowMinimumPeriod()
        {
            var conflatedTimestamps = new List<long>();
            Observable.Range(0, 2)
                .Conflate(_minimumUpdatePeriod, _testScheduler)
                .Subscribe(x => conflatedTimestamps.Add(_testScheduler.Now.Ticks));

            _testScheduler.Start();

            Assert.AreEqual(2, conflatedTimestamps.Count);
            Assert.AreEqual(_startTicks + _minimumUpdatePeriod.Ticks + 1, conflatedTimestamps[1]);
        }

        [Test]
        public void ThreeSubsequentUpdateShouldBeConflatedToTwo()
        {
            var conflatedTimestamps = new List<Timestamped<int>>();
            Observable.Range(0, 3)
                .Conflate(_minimumUpdatePeriod, _testScheduler)
                .Timestamp(_testScheduler)
                .Subscribe(conflatedTimestamps.Add);

            _testScheduler.Start();

            Assert.AreEqual(2, conflatedTimestamps.Count);
            Assert.AreEqual(_startTicks + _minimumUpdatePeriod.Ticks + 1, conflatedTimestamps[1].Timestamp.Ticks);
            Assert.AreEqual(2, conflatedTimestamps[1].Value);
        }

        [Test]
        public void TwoUpdatesFarFromEachOtherShouldNotBeDelayed()
        {
            var conflatedTimestamps = new List<Timestamped<long>>();
            Observable.Return((long)1).Concat(Observable.Timer(_minimumUpdatePeriod + _minimumUpdatePeriod, _testScheduler))
                .Conflate(_minimumUpdatePeriod, _testScheduler)
                .Timestamp(_testScheduler)
                .Subscribe(conflatedTimestamps.Add);

            _testScheduler.Start();

            Assert.AreEqual(2, conflatedTimestamps.Count);
            Assert.AreEqual(_startTicks + _minimumUpdatePeriod.Ticks * 2 + 1, conflatedTimestamps[1].Timestamp.Ticks);
        }
    }
}