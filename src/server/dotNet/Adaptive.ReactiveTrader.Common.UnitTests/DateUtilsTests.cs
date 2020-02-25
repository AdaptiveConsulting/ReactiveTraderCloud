using System;
using Xunit;

namespace Adaptive.ReactiveTrader.Common.UnitTests
{
    public class DateUtilsTests
    {
        [Theory]
        [InlineData("Wednesday", 8, 10)]
        [InlineData("Thursday", 9, 13)]
        [InlineData("Friday", 10, 14)]
        [InlineData("Saturday", 11, 14)]
        [InlineData("Sunday", 12, 14)]
        public void AddWeekDaysTest(string label, int startDay, int expectedDay)
        {
            var currentDate = new DateTimeOffset(2020, 1, startDay, 0, 0, 0, TimeSpan.Zero);
            var expectedDate = new DateTimeOffset(2020, 1, expectedDay, 0, 0, 0, TimeSpan.Zero);

            var resultDate = currentDate.AddWeekDays(2);

            Assert.Equal(expectedDate, resultDate);
        }
    }
}
