using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Concurrency;
using Adaptive.ReactiveTrader.Client.Domain;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Client.Domain.Repositories;
using Adaptive.ReactiveTrader.Shared.Logging;
using Adaptive.ReactiveTrader.Shared.UI;
using PropertyChanged;

namespace Adaptive.ReactiveTrader.Client.UI.Blotter
{
    [AddINotifyPropertyChangedInterface]
    public class BlotterViewModel : ViewModelBase, IBlotterViewModel, IDisposable
    {
        private readonly ITradeRepository _tradeRepository;
        private readonly Func<ITrade, bool, ITradeViewModel> _tradeViewModelFactory;
        private readonly IConcurrencyService _concurrencyService;
        private readonly SerialDisposable _loadingDisposable = new SerialDisposable();

        private bool _stale;
        private bool _stowReceived;
        private readonly ILog _log;

        public ObservableCollection<ITradeViewModel> Trades { get; }

        public BlotterViewModel(IReactiveTrader reactiveTrader,
                                Func<ITrade, bool, ITradeViewModel> tradeViewModelFactory,
                                IConcurrencyService concurrencyService,
                                ILoggerFactory loggerFactory)
        {
            _tradeRepository = reactiveTrader.TradeRepository;
            _tradeViewModelFactory = tradeViewModelFactory;
            _concurrencyService = concurrencyService;
            Trades = new ObservableCollection<ITradeViewModel>();
            _log = loggerFactory.Create(typeof (BlotterViewModel));

            LoadTrades();
        }
        
        public void Dispose()
        {
            _loadingDisposable.Dispose();
        }

        private void LoadTrades()
        {
            _loadingDisposable.Disposable = _tradeRepository.GetTradesStream()
                            .ObserveOn(_concurrencyService.Dispatcher)
                            .SubscribeOn(_concurrencyService.TaskPool)
                            .Subscribe(
                                AddTrades,
                                ex => _log.Error("An error occurred within the trade stream", ex));
        }

        private void AddTrades(IEnumerable<ITrade> trades)
        {
            var allTrades = trades as IList<ITrade> ?? trades.ToList();
            if (!allTrades.Any())
            {
                // empty list of trades means we are disconnected
                _stale = true;
            }
            else
            {
                if (_stale)
                {
                    Trades.Clear();
                    _stale = false;
                }
            }

            allTrades.ForEach(trade =>
                {
                    var tradeViewModel = _tradeViewModelFactory(trade, !_stowReceived);
                    Trades.Insert(0, tradeViewModel);
                });

            _stowReceived = true;
        }
    }
}
