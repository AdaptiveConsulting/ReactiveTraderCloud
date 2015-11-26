using System;
using System.Globalization;

namespace Adaptive.ReactiveTrader.Server.Common
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
            var date = DateTime.ParseExact(dateTimeString, "o", CultureInfo.CurrentCulture);
            return date.ToUniversalTime();
        }
    }
}
