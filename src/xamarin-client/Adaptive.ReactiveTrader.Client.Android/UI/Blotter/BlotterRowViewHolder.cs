using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;

namespace Adaptive.ReactiveTrader.Client.Android.UI.Blotter
{
    public class BlotterRowViewHolder : RecyclerView.ViewHolder
    {
        public TextView TradeDate { get; }
        public TextView Direction { get; }
        public TextView CurrencyPair { get; }
        public TextView Notional { get; }
        public TextView SpotRate { get; }
        public TextView Status { get; }
        public TextView ValueDate { get; }
        public TextView TraderName { get; }
        public LinearLayout BlotterRow { get; }

        public BlotterRowViewHolder(View itemView)
            : base(itemView)
        {
            TradeDate = itemView.FindViewById<TextView>(Resource.Id.BlotterRowTradeDateTextView);
            Direction = itemView.FindViewById<TextView>(Resource.Id.BlotterRowDirectionTextView);
            CurrencyPair = itemView.FindViewById<TextView>(Resource.Id.BlotterRowCurrencyPairTextView);
            Notional = itemView.FindViewById<TextView>(Resource.Id.BlotterRowNotionalTextView);
            SpotRate = itemView.FindViewById<TextView>(Resource.Id.BlotterRowSpotRateTextView);
            Status = itemView.FindViewById<TextView>(Resource.Id.BlotterRowStatusTextView);
            ValueDate = itemView.FindViewById<TextView>(Resource.Id.BlotterRowValueDateTextView);
            TraderName = itemView.FindViewById<TextView>(Resource.Id.BlotterRowTraderNameTextView);
            BlotterRow = itemView.FindViewById<LinearLayout>(Resource.Id.BlotterRow);
        }
    }
}