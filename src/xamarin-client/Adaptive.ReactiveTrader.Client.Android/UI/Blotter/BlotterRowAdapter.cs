using System;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Globalization;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.UI.Blotter;
using Adaptive.ReactiveTrader.Shared.Extensions;
using Android.Support.V7.Widget;
using Android.Views;

namespace Adaptive.ReactiveTrader.Client.Android.UI.Blotter
{
    public class BlotterRowAdapter : RecyclerView.Adapter
    {
        private readonly ObservableCollection<ITradeViewModel> _tradesCollection;
        private readonly IDisposable _collectionChangedSubscription;
        private bool _animationsEnabled;

        public BlotterRowAdapter(RecyclerView recyclerView, ObservableCollection<ITradeViewModel> tradesCollection)
        {
            _tradesCollection = tradesCollection;
            
            // TODO QL
            //var animator = new BlotterRowAnimator();
            //recyclerView.SetItemAnimator(animator);

            _tradesCollection = tradesCollection;
            _collectionChangedSubscription = _tradesCollection.ObserveCollection()
                .Subscribe(changeArgs =>
                {
                    if (_animationsEnabled && changeArgs.Action == NotifyCollectionChangedAction.Add && changeArgs.NewItems.Count == 1)
                    {
                        Console.WriteLine($"Count: {_tradesCollection.Count}");
                        NotifyItemInserted(changeArgs.NewStartingIndex);
                        recyclerView.SmoothScrollToPosition(0);
                    }
                    else
                    {
                        NotifyDataSetChanged();

                        if (!_animationsEnabled)
                        {
                            recyclerView.ScrollToPosition(0);
                        }
                    }
                });

            _tradesCollection.ObserveCollection()
                .FirstAsync()
                .Delay(TimeSpan.FromSeconds(1))
                .Subscribe(_ =>
                {
                    _animationsEnabled = true;
                });
        }
        
        public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
        {
            
            var tradeViewModel = _tradesCollection[position];
            var viewHolder = (BlotterRowViewHolder)holder;
            viewHolder.TradeDate.Text = tradeViewModel.TradeDate.ToString("dd MMM yy hh:mm");
            viewHolder.Direction.Text = tradeViewModel.Direction.ToString();
            viewHolder.CurrencyPair.Text = tradeViewModel.CurrencyPair;
            viewHolder.Notional.Text = tradeViewModel.Notional;
            viewHolder.SpotRate.Text = tradeViewModel.SpotRate.ToString(CultureInfo.InvariantCulture);
            viewHolder.Status.Text = tradeViewModel.TradeStatus;
            viewHolder.ValueDate.Text = tradeViewModel.ValueDate.ToString("dd MMM yy");
            viewHolder.TraderName.Text = tradeViewModel.TraderName;
        }

        public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
        {
            var v = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.BlotterRowView, parent, false);
            var holder = new BlotterRowViewHolder(v);
            return holder;
        }

        public override int ItemCount => _tradesCollection.Count;

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _collectionChangedSubscription.Dispose();
            }
        }
    }
}