namespace Adaptive.ReactiveTrader.Client.Android.UI.SpotTiles
{
    public enum Direction
    {
        X,
        Y
    }

    public enum ScaleUpDownEnum
    {
        /**
		 * The view will be scaled up from the scale value until it's at 100% zoom level (i.e. no zoom).
		 */
        ScaleUp,
        /**
		 * The view will be scaled down starting at no zoom (100% zoom level) until it's at a specified zoom level.
		 */
        ScaleDown,
        /**
		 * The view will cycle through a zoom down and then zoom up.
		 */
        ScaleCycle,
        /**
		 * No zoom effect is applied.
		 */
        ScaleNone
    }

    public static class ScaleExtention
    {
        public static float GetScale(this ScaleUpDownEnum scale, float max, float iter)
        {
            switch (scale)
            {
                case ScaleUpDownEnum.ScaleUp:
                    return max + (1 - max) * iter;

                case ScaleUpDownEnum.ScaleDown:
                    return 1 - (1 - max) * iter;

                case ScaleUpDownEnum.ScaleCycle:
                {
                    bool halfWay = (iter > 0.5);

                    if (halfWay)
                    {
                        return max + (1 - max) * (iter - 0.5f) * 2;
                    }
                    return 1 - (1 - max) * (iter * 2);
                        
                }

                default:
                    return 1;
            }
        }

    }
}