using System;
using System.Reactive.Linq;
using System.Windows.Input;
using Adaptive.ReactiveTrader.Client.Concurrency;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Shared.Extensions;
using Adaptive.ReactiveTrader.Shared.Logging;
using Adaptive.ReactiveTrader.Shared.UI;
using PropertyChanged;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    [ImplementPropertyChanged]
    public class OneWayPriceViewModel : ViewModelBase, IOneWayPriceViewModel
    {
        private readonly ISpotTilePricingViewModel _parent;
        private readonly IConcurrencyService _concurrencyService;
        private readonly ILog _log;

        private readonly DelegateCommand _executeCommand;
        private IExecutablePrice _executablePrice;

        public Direction Direction { get; }
        public string BigFigures { get; private set; }
        public string Pips { get; private set; }
        public string TenthOfPip { get; private set; }
        public bool IsExecuting { get; private set; }
        public SpotTileExecutionMode ExecutionMode { get; set; }

        public OneWayPriceViewModel(Direction direction, ISpotTilePricingViewModel parent, IConcurrencyService concurrencyService, ILoggerFactory loggerFactory)
        {
            _parent = parent;
            _concurrencyService = concurrencyService;
            Direction = direction;
            _log = loggerFactory.Create(typeof (OneWayPriceViewModel));

            _executeCommand = new DelegateCommand(OnExecute, CanExecute);
        }

        public ICommand ExecuteCommand => _executeCommand;


        public void OnPrice(IExecutablePrice executablePrice)
        {
            _executablePrice = executablePrice;

            var formattedPrice = PriceFormatter.GetFormattedPrice(_executablePrice.Rate,
                executablePrice.Parent.CurrencyPair.RatePrecision, executablePrice.Parent.CurrencyPair.PipsPosition);

            BigFigures = formattedPrice.BigFigures;
            Pips = formattedPrice.Pips;
            TenthOfPip = formattedPrice.TenthOfPip;

            _executeCommand.RaiseCanExecuteChanged();
        }

        public void OnStalePrice()
        {
            _executablePrice = null;

            BigFigures = string.Empty;
            Pips = string.Empty;
            TenthOfPip = string.Empty;

            _executeCommand.RaiseCanExecuteChanged();
        }

        private bool CanExecute()
        {
            return _executablePrice != null && !IsExecuting;
        }

        private void OnExecute()
        {
            long notional;
            if (!long.TryParse(_parent.Notional, out notional))
            {
                return;
            }
            IsExecuting = true;

            if (ExecutionMode == SpotTileExecutionMode.Async)
            {
                ExecuteAsync(notional);
            }
            else if (ExecutionMode == SpotTileExecutionMode.Sync)
            {
                ExecuteSync(notional);
            }
        }

        private void ExecuteAsync(long notional)
        {
            _executablePrice.ExecuteRequest(notional, _parent.DealtCurrency)
                .ObserveOn(_concurrencyService.Dispatcher)
                .SubscribeOn(_concurrencyService.TaskPool)
                .Subscribe(OnExecutedResult, OnExecutionError);
        }

        private void ExecuteSync(long notional)
        {
            try
            {
                OnExecutedResult(_executablePrice.ExecuteRequest(notional, _parent.DealtCurrency).Wait());
            }
            catch (Exception ex)
            {
                OnExecutionError(ex);
            }

        }

        private void OnExecutionError(Exception exception)
        {
            if (exception is TimeoutException)
            {
                OnExecutionTimeout();
            }
            else
            {
                _log.Error("An error occurred while processing the trade request.", exception);
                _parent.OnExecutionError("An error occurred while executing the trade. Please check your blotter and if your position is unknown, contact your support representative.");
            }
            IsExecuting = false;
        }

        private void OnExecutedResult(IStale<ITrade> trade)
        {
            if (trade.IsStale)
            {
                OnExecutionTimeout();
            }
            else
            {
                _log.Info("Trade executed");
                _parent.OnTrade(trade.Update);
            }
            IsExecuting = false;
        }

        private void OnExecutionTimeout()
        {
            _log.Error("Trade execution request timed out.");
            _parent.OnExecutionError(
                "No response was received from the server, the execution status is unknown. Please contact your sales representative.");
        }
    }
}
