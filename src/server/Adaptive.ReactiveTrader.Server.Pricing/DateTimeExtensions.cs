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

    public static DateTime UnixTimeStampToDateTime(double unixTimeStamp)
    {
      // Unix timestamp is seconds past epoch
      var dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
      dtDateTime = dtDateTime.AddSeconds(unixTimeStamp);
      return dtDateTime;
    }

  }
}
