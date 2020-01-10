using System;
using System.Globalization;

namespace Adaptive.ReactiveTrader.Common
{
    public static class DateUtils
    {
        public static string ToSerializationFormat(DateTimeOffset dateTimeOffset)
        {
            if (dateTimeOffset.Offset != TimeSpan.Zero)
            {
                throw new ArgumentException("DateTime must be in UTC format to serialize");
            }
            return dateTimeOffset.ToString("u");
        }

        public static DateTimeOffset FromSerializationFormat(string dateTimeString)
        {
            var date = DateTimeOffset.ParseExact(dateTimeString, "u", CultureInfo.CurrentCulture);
            return date.ToUniversalTime();
        }

        public static DateTimeOffset UnixTimeStampToDateTime(double unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            var dtDateTime = new DateTimeOffset(1970, 1, 1, 0, 0, 0, 0, TimeSpan.Zero);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp);
            return dtDateTime;
        }

        public static DateTimeOffset AddWeekDays(this DateTimeOffset date, int value)
        {
            for (var i = 0; i < value; i++)
            {
                date = date.AddDays(1);

                switch (date.DayOfWeek)
                {
                    case DayOfWeek.Saturday:
                        date = date.AddDays(2);
                        break;
                    case DayOfWeek.Sunday:
                        date = date.AddDays(1);
                        break;
                }
            }

            return date;
        }
    }
}
