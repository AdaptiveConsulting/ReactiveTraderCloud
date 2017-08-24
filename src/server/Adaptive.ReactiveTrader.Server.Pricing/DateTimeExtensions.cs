using System;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public static class DateTimeExtensions
    {
        public static DateTime ToWeekday(this DateTime date)
        {
            switch (date.DayOfWeek)
            {
                case DayOfWeek.Saturday:
                    return date.AddDays(2);
                case DayOfWeek.Sunday:
                    return date.AddDays(1);
                default:
                    return date;
            }
        }
    }
}