using System;

namespace Adaptive.ReactiveTrader.Shared.Extensions
{
    public static class ArrayExtensions
    {
        public static void Shuffle<T>(this T[] source)
        {
            var random = new Random(unchecked(Environment.TickCount * 31));
            int n = source.Length;
            while (n > 1)
            {
                n--;
                int k = random.Next(n + 1);
                T value = source[k];
                source[k] = source[n];
                source[n] = value;
            }
        }
    }
}