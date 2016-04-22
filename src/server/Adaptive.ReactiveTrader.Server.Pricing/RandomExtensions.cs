using System;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public static class RandomExtensions
    {
        public static double NextNormal(this Random random)
        {
            return Math.Sqrt(-2d*Math.Log(random.NextDouble()))*Math.Sin(2d*Math.PI*random.NextDouble());
        }
    }
}