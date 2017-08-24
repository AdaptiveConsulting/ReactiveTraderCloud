using System;
using Adaptive.ReactiveTrader.Shared.Extensions;
using NUnit.Framework;

namespace Adaptive.ReactiveTrader.Tests.Shared.Extensions
{
    [TestFixture]
    public class DateTimeExtensions
    {
        [Test]
        public void ToWeekdayForAWeekdayShouldReturnTheSameDay()
        {
            var dt = new DateTime(2015, 11, 09);
            var res = dt.ToWeekday();

            Assert.AreEqual(dt, res);
        }

        [Test]
        public void ToWeekdayForASaturdayShouldReturnTheFollowingMonday()
        {
            var dt = new DateTime(2015, 11, 07);
            var result = dt.ToWeekday();

            Assert.AreEqual(new DateTime(2015, 11, 09), result);
        }

        [Test]
        public void ToWeekdayForASundayShouldReturnTheFollowingMonday()
        {
            var dt = new DateTime(2015, 11, 08);
            var result = dt.ToWeekday();

            Assert.AreEqual(new DateTime(2015, 11, 09), result);
        }
    }
}