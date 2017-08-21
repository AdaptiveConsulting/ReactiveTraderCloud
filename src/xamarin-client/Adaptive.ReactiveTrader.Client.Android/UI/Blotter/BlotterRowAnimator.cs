using System;
using System.Threading.Tasks;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.Support.V4.Content;
using Android.Support.V4.View;
using Android.Support.V7.Widget;

namespace Adaptive.ReactiveTrader.Client.Android.UI.Blotter
{
 //   class BlotterRowAnimator : BaseItemAnimator
 //   {
 //       protected override async void AnimateAddImpl(RecyclerView.ViewHolder viewHolder)
 //       {
 //           var flashColor = new Color(ContextCompat.GetColor(viewHolder.ItemView.Context, Resource.Color.blotterFlashBackground));
 //           var normalColor = new Color(ContextCompat.GetColor(viewHolder.ItemView.Context, Resource.Color.blotterBackground));

 //           Drawable[] color = { new ColorDrawable(flashColor), new ColorDrawable(normalColor) };
 //           TransitionDrawable trans = new TransitionDrawable(color);

 //           viewHolder.ItemView.Background = trans;
 //           viewHolder.ItemView.ScaleY = 0;
 //           ViewCompat.Animate(viewHolder.ItemView).Alpha(1).ScaleY(1).SetDuration(150).Start();

 //           await Task.Delay(500);

 //           trans.StartTransition(700);
 //       }

 //       protected override void AnimateRemoveImpl(RecyclerView.ViewHolder p0)
 //       {
 //       }
	//}
}