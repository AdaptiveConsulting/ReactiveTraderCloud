using System.Linq;

namespace Adaptive.ReactiveTrader.Common
{
    public static class StringExtensions
    {
        public static bool IsIn(this string needle, params string[] haystack)
        {
            return haystack.Any(item => item == needle);
        }
    }
}