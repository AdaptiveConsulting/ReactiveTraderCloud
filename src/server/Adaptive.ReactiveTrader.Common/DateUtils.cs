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

        public static DateTime UnixTimeStampToDateTime(double unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            var dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp);
            return dtDateTime;
        }

        public static DateTime AddWeekDays(this DateTime date, double value)
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
