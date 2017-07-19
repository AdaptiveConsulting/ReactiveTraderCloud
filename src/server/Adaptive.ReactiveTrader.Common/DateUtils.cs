using System;
using System.Globalization;

namespace Adaptive.ReactiveTrader.Common
{
    public static class DateUtils
    {
        public static string ToSerializationFormat(DateTime dateTime)
        {
            if (dateTime.Kind != DateTimeKind.Utc)
            {
                throw new ArgumentException("DateTime must be in UTC format to serialize");
            }
            return dateTime.ToString("u");
        }

        public static DateTime FromSerializationFormat(string dateTimeString)
        {
            var date = DateTime.ParseExact(dateTimeString, "u", CultureInfo.CurrentCulture);
            return date.ToUniversalTime();
        }

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