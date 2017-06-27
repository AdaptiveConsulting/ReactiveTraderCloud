using System;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Concurrency;
using Adaptive.ReactiveTrader.Client.UI.SpotTiles;
using Adaptive.ReactiveTrader.Shared.Extensions;
using Android.Support.V7.Widget;
using Android.Views;
using Object = Java.Lang.Object;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Client.Android.UI.SpotTiles
{
	public class SpotTileAdapter : RecyclerView.Adapter
    {
        private readonly ObservableCollection<ISpotTileViewModel> _spotTileCollection;
        readonly IConcurrencyService _concurrencyService;
        private readonly IDisposable _collectionChangedSubscription;
        private int _lastPosition = -1;
        private readonly CompositeDisposable _allSubscriptions = new CompositeDisposable();
		private bool _animate = true;

        public SpotTileAdapter(ObservableCollection<ISpotTileViewModel> spotTileCollection, IConcurrencyService concurrencyService)
        {
            _spotTileCollection = spotTileCollection;
            _concurrencyService = concurrencyService;

            _collectionChangedSubscription = _spotTileCollection
                .ObserveCollection()
                .Throttle(TimeSpan.FromMilliseconds(10))
                .ObserveOn(_concurrencyService.Dispatcher)
                .Subscribe(async eventArgs =>
                {
                    switch (eventArgs.Action)
                    {
                        case NotifyCollectionChangedAction.Add:
                            
                            NotifyItemRangeInserted(eventArgs.NewStartingIndex, eventArgs.NewItems.Count);
                            break;

                        case NotifyCollectionChangedAction.Remove:

                            NotifyItemRangeRemoved(eventArgs.OldStartingIndex, eventArgs.OldItems.Count);
                            break;

                        default:

                            _allSubscriptions.Clear();
                            NotifyDataSetChanged();
                            break;
                    }

					if (_animate)
					{
						await Task.Delay(3000);
						_animate = false;
					}
                });
        }

        public override void OnViewRecycled(Object holder)
        {
            var viewHolder = (SpotTileViewHolder)holder;
            viewHolder.Unbind();

            base.OnViewRecycled(holder);
        }
        
        public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
        {
            var spotTileViewModel = _spotTileCollection[position];
            if (spotTileViewModel.CurrencyPair == null)
            {
                return;
            }
            
            var viewHolder = (SpotTileViewHolder)holder;
            viewHolder.Bind(spotTileViewModel, _concurrencyService);

            if (_animate && position > _lastPosition)
            {
                _lastPosition = position;
                viewHolder.AnimateIn(position);
            }
        }

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
        {
            var v = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.SpotTileView, parent, false);
            var holder = new SpotTileViewHolder(v);
            _allSubscriptions.Add(holder);
            return holder;
        }

        public override int ItemCount => _spotTileCollection.Count;

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _collectionChangedSubscription.Dispose();
                _allSubscriptions.Dispose();
            }
        }
    }
}