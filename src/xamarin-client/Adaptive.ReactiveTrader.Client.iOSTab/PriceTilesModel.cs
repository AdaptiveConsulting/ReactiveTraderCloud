using System;
using System.Linq;
using System.Reactive;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Domain;
using UIKit;
using System.Collections.Generic;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;
using Adaptive.ReactiveTrader.Client.Concurrency;
using Foundation;
using System.Reactive.Disposables;
using System.Collections.ObjectModel;

namespace Adaptive.ReactiveTrader.Client.iOSTab
{
	public class PriceTilesModel : IDisposable
	{
		private readonly IConcurrencyService _concurrencyService;
		private readonly IReactiveTrader _reactiveTrader;
		private readonly CompositeDisposable _disposables = new CompositeDisposable();

		private readonly ObservableCollection<PriceTileModel> _activeCurrencyPairs = new ObservableCollection<PriceTileModel>();

		public PriceTilesModel (IReactiveTrader reactiveTrader, IConcurrencyService concurrencyService)
		{
			this._concurrencyService = concurrencyService;
			this._reactiveTrader = reactiveTrader;
		}

		public void Initialise() {

			this._reactiveTrader.ReferenceData
				.GetCurrencyPairsStream ()
				.ObserveOn(this._concurrencyService.Dispatcher)
				.Subscribe (updates => OnCurrencyPairUpdates(updates));
		}

		public ObservableCollection<PriceTileModel> ActiveCurrencyPairs => _activeCurrencyPairs;

	    private void OnCurrencyPairUpdates (IEnumerable<ICurrencyPairUpdate> updates)
		{
			foreach (var update in updates) {
				if (update.UpdateType == Adaptive.ReactiveTrader.Client.Domain.Models.UpdateType.Add) {

					var tileModel = new PriceTileModel (update.CurrencyPair, this._reactiveTrader.PriceLatencyRecorder, this._concurrencyService);

					_activeCurrencyPairs.Add (tileModel);

				} else {
					// todo handle removal of price tile
				}
			}
		}		

		public PriceTileModel this[int index] => _activeCurrencyPairs [index];

	    public void Dispose ()
		{
			_disposables.Dispose();
		}
	}
}

