using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Concurrency;
using Adaptive.ReactiveTrader.Client.Domain;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;
using Adaptive.ReactiveTrader.Shared.Extensions;
using Adaptive.ReactiveTrader.Shared.Logging;
using Adaptive.ReactiveTrader.Shared.UI;
using Adaptive.ReactiveTrader.Client.Domain.Repositories;
using PropertyChanged;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    [ImplementPropertyChanged]
    public class SpotTilesViewModel : ViewModelBase, ISpotTilesViewModel, IDisposable
    {
        public ObservableCollection<ISpotTileViewModel> SpotTiles { get; private set; }
        private readonly CompositeDisposable _subscriptions = new CompositeDisposable();
        private readonly IReferenceDataRepository _referenceDataRepository;
        private readonly Func<ICurrencyPair, SpotTileSubscriptionMode, ISpotTileViewModel> _spotTileFactory;
        private readonly IConcurrencyService _concurrencyService;
        private readonly ISpotTileViewModel _config;
        private readonly ILog _log;

        public SpotTilesViewModel(IReactiveTrader reactiveTrader,
            Func<ICurrencyPair, SpotTileSubscriptionMode, ISpotTileViewModel> spotTileFactory,
            IConcurrencyService concurrencyService,
            ILoggerFactory loggerFactory)
        {
            _referenceDataRepository = reactiveTrader.ReferenceData;
            _spotTileFactory = spotTileFactory;
            _concurrencyService = concurrencyService;
            _log = loggerFactory.Create(typeof (SpotTilesViewModel));

            SpotTiles = new ObservableCollection<ISpotTileViewModel>();

            _config = spotTileFactory(null, SpotTileSubscriptionMode.Conflate);
            _config.ToConfig();

            // SpotTiles.Add(_config);

            _subscriptions.Add(
                _config.Config.ObserveProperty(p => p.SubscriptionMode)
                    .Subscribe(subscriptionMode => SpotTiles.Where(vm => vm.Pricing != null).ForEach(vm => vm.Pricing.SubscriptionMode = subscriptionMode)));

            _subscriptions.Add(
                _config.Config.ObserveProperty(p => p.ExecutionMode)
                    .Subscribe(executionMode => SpotTiles.Where(vm => vm.Pricing != null).ForEach(vm => vm.Pricing.ExecutionMode = executionMode)));

            LoadSpotTiles();
        }

        public void Dispose()
        {
            _subscriptions.Dispose();
        }

        private void LoadSpotTiles()
        {
            _referenceDataRepository.GetCurrencyPairsStream()
                .ObserveOn(_concurrencyService.TaskPool)
                .SubscribeOn(_concurrencyService.TaskPool)
                .Subscribe(
                    currencyPairs => currencyPairs.ForEach(HandleCurrencyPairUpdate),
                    error => _log.Error("Failed to get currencies", error));
        }

        private void HandleCurrencyPairUpdate(ICurrencyPairUpdate update)
        {
            var spotTileViewModel = SpotTiles.FirstOrDefault(stvm => stvm.CurrencyPair == update.CurrencyPair.Symbol);
            if (update.UpdateType == UpdateType.Add)
            {
                if (spotTileViewModel != null)
                {
                    // we already have a tile for this currency pair
                    return;
                }

                var spotTile = _spotTileFactory(update.CurrencyPair, _config.Config.SubscriptionMode);
                SpotTiles.Add(spotTile);
            }
            else
            {
                if (spotTileViewModel != null)
                {
                    SpotTiles.Remove(spotTileViewModel);
                    spotTileViewModel.Dispose();
                }
            }
        }
    }
}
