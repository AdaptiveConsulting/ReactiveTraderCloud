using System;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public static class RandomExtensions
    {
        public static double NextNormal(this Random random)
        {
            var r1 = random.NextDouble();
            while (r1 < double.Epsilon)
            {
                r1 = random.NextDouble();
            }

            return Math.Sqrt(-2d*Math.Log(r1))*Math.Sin(2d*Math.PI*random.NextDouble());
        }
    }
}