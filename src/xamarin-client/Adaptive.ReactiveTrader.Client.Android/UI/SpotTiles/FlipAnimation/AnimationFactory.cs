using System;
using Android.Views;
using Android.Views.Animations;
using Android.Widget;

namespace Adaptive.ReactiveTrader.Client.Android.UI.SpotTiles
{
    public enum FlipDirection
    {
        LeftRight,
        RightLeft,
        TopBottom,
        BottomTop
    }

    public static class FlipDirectionExtentions
    {
        public static float StartDegreeForSecondView(this FlipDirection direction)
        {
            switch (direction)
            {
                case FlipDirection.LeftRight:
                case FlipDirection.TopBottom:
                    return -90;
                case FlipDirection.RightLeft:
                case FlipDirection.BottomTop:
                    return 90;
                default:
                    return 0;
            }
        }

        public static float EndDegreeForFirstView(this FlipDirection direction)
        {
            switch (direction)
            {
                case FlipDirection.LeftRight:
                case FlipDirection.TopBottom:
                    return 90;
                case FlipDirection.RightLeft:
                case FlipDirection.BottomTop:
                    return -90;
                default:
                    return 0;
            }
        }

        public static FlipDirection OtherDirection(this FlipDirection direction)
        {
            switch (direction)
            {
                case FlipDirection.LeftRight:
                    return FlipDirection.RightLeft;
                case FlipDirection.TopBottom:
                    return FlipDirection.BottomTop;
                case FlipDirection.RightLeft:
                    return FlipDirection.LeftRight;
                case FlipDirection.BottomTop:
                    return FlipDirection.TopBottom;
                default:
                    throw new InvalidOperationException();
            }
        }
    }

    public class AnimationFactory
    {

        private static int _defaultFlipTransitionDuration = 500;

        /**
         * The {@code FlipDirection} enumeration defines the most typical flip view transitions: left-to-right and right-to-left. {@code FlipDirection} is used during the creation of {@link FlipAnimation} animations.
         * 
         * @author Ephraim A. Tekle
         *
         */
        /**
	 * Create a pair of {@link FlipAnimation} that can be used to flip 3D transition from {@code fromView} to {@code toView}. A typical use case is with {@link ViewAnimator} as an out and in transition.
	 * 
	 * NOTE: Avoid using this method. Instead, use {@link #flipTransition}.
	 *  
	 * @param fromView the view transition away from
	 * @param toView the view transition to
	 * @param dir the flip direction
	 * @param duration the transition duration in milliseconds
	 * @param interpolator the interpolator to use (pass {@code null} to use the {@link AccelerateInterpolator} interpolator) 
	 * @return
	 */

        public static Animation[] FlipAnimation(View fromView, View toView, FlipDirection dir, long duration, IInterpolator interpolator)
        {
            Animation[] result = new Animation[2];
            float centerX;
            float centerY;

            centerX = fromView.Width/2.0f;
            centerY = fromView.Height/2.0f;

            FlipAnimation outFlip = new FlipAnimation(0, dir.EndDegreeForFirstView(), centerX, centerY,
                SpotTiles.FlipAnimation.ScaleDefault, ScaleUpDownEnum.ScaleDown);
            outFlip.Duration = duration;
            outFlip.FillAfter = true;
            outFlip.Interpolator = interpolator ?? new AccelerateInterpolator();

            if (dir == FlipDirection.BottomTop || dir == FlipDirection.TopBottom)
                outFlip.Direction = Direction.X;
            else
                outFlip.Direction = Direction.Y;

            AnimationSet outAnimation = new AnimationSet(true);
            outAnimation.AddAnimation(outFlip);
            result[0] = outAnimation;

            // Uncomment the following if toView has its layout established (not the case if using ViewFlipper and on first show)
            //centerX = toView.getWidth() / 2.0f;
            //centerY = toView.getHeight() / 2.0f; 

            FlipAnimation inFlip = new FlipAnimation(dir.StartDegreeForSecondView(), 0, centerX, centerY,
                SpotTiles.FlipAnimation.ScaleDefault, ScaleUpDownEnum.ScaleUp);
            inFlip.Duration = duration;
            inFlip.FillAfter = true;
            inFlip.StartOffset = duration;
            inFlip.Interpolator = interpolator ?? new AccelerateInterpolator();


            if (dir == FlipDirection.BottomTop || dir == FlipDirection.TopBottom)
                outFlip.Direction = Direction.X;
            else
                outFlip.Direction = Direction.Y;

            AnimationSet inAnimation = new AnimationSet(true);
            inAnimation.AddAnimation(inFlip);
            result[1] = inAnimation;

            return result;

        }

        /**
	 * Flip to the next view of the {@code ViewAnimator}'s subviews. A call to this method will initiate a {@link FlipAnimation} to show the next View.  
	 * If the currently visible view is the last view, flip direction will be reversed for this transition.
	 *  
	 * @param viewAnimator the {@code ViewAnimator}
	 * @param dir the direction of flip
	 */

        public static void FlipTransition(ViewAnimator viewAnimator, FlipDirection dir)
        {
            FlipTransition(viewAnimator, dir, _defaultFlipTransitionDuration);
        }

        /**
	 * Flip to the next view of the {@code ViewAnimator}'s subviews. A call to this method will initiate a {@link FlipAnimation} to show the next View.  
	 * If the currently visible view is the last view, flip direction will be reversed for this transition.
	 *  
	 * @param viewAnimator the {@code ViewAnimator}
	 * @param dir the direction of flip
	 * @param duration the transition duration in milliseconds
	 */

        public static void FlipTransition(ViewAnimator viewAnimator, FlipDirection dir, long duration)
        {

            View fromView = viewAnimator.CurrentView;
            int currentIndex = viewAnimator.DisplayedChild;
            int nextIndex = (currentIndex + 1)%viewAnimator.ChildCount;

            View toView = viewAnimator.GetChildAt(nextIndex);

            Animation[] animc = AnimationFactory.FlipAnimation(fromView, toView,
                (nextIndex < currentIndex ? dir.OtherDirection() : dir), duration, new AnticipateOvershootInterpolator());

            viewAnimator.OutAnimation = animc[0];
            viewAnimator.InAnimation = animc[1];

            viewAnimator.ShowNext();
        }

        //////////////


        /**
	 * Slide animations to enter a view from left.
	 * 
	 * @param duration the animation duration in milliseconds
	 * @param interpolator the interpolator to use (pass {@code null} to use the {@link AccelerateInterpolator} interpolator) 	
	 * @return a slide transition animation
	 */

        public static Animation InFromLeftAnimation(long duration, IInterpolator interpolator)
        {
            Animation inFromLeft = new TranslateAnimation(
                Dimension.RelativeToParent, -1.0f, Dimension.RelativeToParent, 0.0f,
                Dimension.RelativeToParent, 0.0f, Dimension.RelativeToParent, 0.0f
                );
            inFromLeft.Duration = duration;
            inFromLeft.Interpolator = interpolator ?? new AccelerateInterpolator();
            return inFromLeft;
        }

        /**
	 * Slide animations to hide a view by sliding it to the right
	 * 
	 * @param duration the animation duration in milliseconds
	 * @param interpolator the interpolator to use (pass {@code null} to use the {@link AccelerateInterpolator} interpolator) 	
	 * @return a slide transition animation
	 */

        public static Animation OutToRightAnimation(long duration, IInterpolator interpolator)
        {
            Animation outtoRight = new TranslateAnimation(
                Dimension.RelativeToParent, 0.0f, Dimension.RelativeToParent, +1.0f,
                Dimension.RelativeToParent, 0.0f, Dimension.RelativeToParent, 0.0f
                );
            outtoRight.Duration = duration;
            outtoRight.Interpolator = interpolator ?? new AccelerateInterpolator();
            return outtoRight;
        }

        /**
	 * Slide animations to enter a view from right.
	 * 
	 * @param duration the animation duration in milliseconds
	 * @param interpolator the interpolator to use (pass {@code null} to use the {@link AccelerateInterpolator} interpolator) 	
	 * @return a slide transition animation
	 */

        public static Animation InFromRightAnimation(long duration, IInterpolator interpolator)
        {

            Animation inFromRight = new TranslateAnimation(
                Dimension.RelativeToParent, +1.0f, Dimension.RelativeToParent, 0.0f,
                Dimension.RelativeToParent, 0.0f, Dimension.RelativeToParent, 0.0f
                );
            inFromRight.Duration = duration;
            inFromRight.Interpolator = interpolator ?? new AccelerateInterpolator();
            return inFromRight;
        }

        /**
	 * Slide animations to hide a view by sliding it to the left.
	 * 
	 * @param duration the animation duration in milliseconds
	 * @param interpolator the interpolator to use (pass {@code null} to use the {@link AccelerateInterpolator} interpolator) 	
	 * @return a slide transition animation
	 */

        public static Animation OutToLeftAnimation(long duration, IInterpolator interpolator)
        {
            Animation outtoLeft = new TranslateAnimation(
                Dimension.RelativeToParent, 0.0f, Dimension.RelativeToParent, -1.0f,
                Dimension.RelativeToParent, 0.0f, Dimension.RelativeToParent, 0.0f
                );
            outtoLeft.Duration = duration;
            outtoLeft.Interpolator = interpolator ?? new AccelerateInterpolator();
            return outtoLeft;
        }

        /**
	 * Slide animations to enter a view from top.
	 * 
	 * @param duration the animation duration in milliseconds
	 * @param interpolator the interpolator to use (pass {@code null} to use the {@link AccelerateInterpolator} interpolator) 	
	 * @return a slide transition animation
	 */

        public static Animation InFromTopAnimation(long duration, IInterpolator interpolator)
        {
            Animation infromtop = new TranslateAnimation(
                Dimension.RelativeToParent, 0.0f, Dimension.RelativeToParent, 0.0f,
                Dimension.RelativeToParent, -1.0f, Dimension.RelativeToParent, 0.0f
                );
            infromtop.Duration = duration;
            infromtop.Interpolator = interpolator ?? new AccelerateInterpolator();
            return infromtop;
        }

        /**
	 * Slide animations to hide a view by sliding it to the top
	 * 
	 * @param duration the animation duration in milliseconds
	 * @param interpolator the interpolator to use (pass {@code null} to use the {@link AccelerateInterpolator} interpolator) 	
	 * @return a slide transition animation
	 */

        public static Animation OutToTopAnimation(long duration, IInterpolator interpolator)
        {
            Animation outtotop = new TranslateAnimation(
                Dimension.RelativeToParent, 0.0f, Dimension.RelativeToParent, 0.0f,
                Dimension.RelativeToParent, 0.0f, Dimension.RelativeToParent, -1.0f
                );
            outtotop.Duration = duration;
            outtotop.Interpolator = interpolator ?? new AccelerateInterpolator();
            return outtotop;
        }

        /**
	 * A fade animation that will fade the subject in by changing alpha from 0 to 1.
	 * 
	 * @param duration the animation duration in milliseconds
	 * @param delay how long to wait before starting the animation, in milliseconds
	 * @return a fade animation
	 * @see #fadeInAnimation(View, long)
	 */

        public static Animation FadeInAnimation(long duration, long delay)
        {

            Animation fadeIn = new AlphaAnimation(0, 1);
            fadeIn.Interpolator = new DecelerateInterpolator();
            fadeIn.Duration = duration;
            fadeIn.StartOffset = delay;

            return fadeIn;
        }

        /**
	 * A fade animation that will fade the subject out by changing alpha from 1 to 0.
	 * 
	 * @param duration the animation duration in milliseconds
	 * @param delay how long to wait before starting the animation, in milliseconds
	 * @return a fade animation
	 * @see #fadeOutAnimation(View, long)
	 */

        public static Animation FadeOutAnimation(long duration, long delay)
        {

            Animation fadeOut = new AlphaAnimation(1, 0);
            fadeOut.Interpolator = new AccelerateInterpolator();
            fadeOut.StartOffset = delay;
            fadeOut.Duration = duration;

            return fadeOut;
        }

        /**
	 * A fade animation that will ensure the View starts and ends with the correct visibility
	 * @param view the View to be faded in
	 * @param duration the animation duration in milliseconds
	 * @return a fade animation that will set the visibility of the view at the start and end of animation
	 */

        public static Animation FadeInAnimation(long duration, View view)
        {
            Animation animation = FadeInAnimation(500, 0);
            animation.AnimationEnd += (sender, args) => { view.Visibility = ViewStates.Visible; };
            animation.AnimationStart += (sender, args) => { view.Visibility = ViewStates.Gone; };
            return animation;
        }


        public static Animation FadeOutAnimation(long duration, View view)
        {
            Animation animation = FadeOutAnimation(500, 0);
            animation.AnimationEnd += (sender, args) => { view.Visibility = ViewStates.Gone; };
            animation.AnimationStart += (sender, args) => { view.Visibility = ViewStates.Visible; };
            return animation;
        }


        /**
	 * Creates a pair of animation that will fade in, delay, then fade out
	 * @param duration the animation duration in milliseconds
	 * @param delay how long to wait after fading in the subject and before starting the fade out
	 * @return a fade in then out animations
	 */

        public static Animation[] FadeInThenOutAnimation(long duration, long delay)
        {
            return new Animation[] {FadeInAnimation(duration, 0), FadeOutAnimation(duration, duration + delay)};
        }

/**
 * Fades the view in. Animation starts right away.
 * @param v the view to be faded in
 */

        public static void FadeOut(View v)
        {
            if (v == null) return;
            v.StartAnimation(FadeOutAnimation(500, v));
        }

/**
 * Fades the view out. Animation starts right away.
 * @param v the view to be faded out
 */

        public static void FadeIn(View v)
        {
            if (v == null) return;

            v.StartAnimation(FadeInAnimation(500, v));
        }

/**
 * Fades the view in, delays the specified amount of time, then fades the view out
 * @param v the view to be faded in then out
 * @param delay how long the view will be visible for
 */

        public static void FadeInThenOut(View v, long delay)
        {
            if (v == null) return;

            v.Visibility = ViewStates.Visible;
            AnimationSet animation = new AnimationSet(true);
            Animation[] fadeInOut = FadeInThenOutAnimation(500, delay);
            animation.AddAnimation(fadeInOut[0]);
            animation.AddAnimation(fadeInOut[1]);
            animation.AnimationEnd += (sender, args) => v.Visibility = ViewStates.Gone;
            animation.AnimationStart += (sender, args) => v.Visibility = ViewStates.Visible;

        }
    }
}