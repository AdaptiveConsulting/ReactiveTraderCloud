using System;
using System.Windows.Input;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    public class SpotTileConfigViewModel : ViewModelBase,  ISpotTileConfigViewModel
    {
        private readonly DelegateCommand _standardCommand;
        private readonly DelegateCommand _dropFrameCommand;
        private readonly DelegateCommand _conflateCommand;
        private readonly DelegateCommand _constantRateCommand;
        private readonly DelegateCommand _syncCommand;
        private readonly DelegateCommand _asyncCommand;

        public SpotTileConfigViewModel()
        {
            _standardCommand = CreateSubscriptionModeCommand(SpotTileSubscriptionMode.OnDispatcher);
            _dropFrameCommand = CreateSubscriptionModeCommand(SpotTileSubscriptionMode.ObserveLatestOnDispatcher);
            _conflateCommand = CreateSubscriptionModeCommand(SpotTileSubscriptionMode.Conflate);
            _constantRateCommand = CreateSubscriptionModeCommand(SpotTileSubscriptionMode.ConstantRate);

            _syncCommand = CreateExecutionModeCommand(SpotTileExecutionMode.Sync);
            _asyncCommand = CreateExecutionModeCommand(SpotTileExecutionMode.Async);
        }

        private DelegateCommand CreateExecutionModeCommand(SpotTileExecutionMode spotTileExecutionMode)
        {
            return new DelegateCommand(() => Execute(spotTileExecutionMode), () => CanExecute(spotTileExecutionMode));
        }

        private DelegateCommand CreateSubscriptionModeCommand(SpotTileSubscriptionMode spotTileSubscriptionMode)
        {
            return new DelegateCommand(() => Execute(spotTileSubscriptionMode), () => CanExecute(spotTileSubscriptionMode));
        }

        public ICommand StandardCommand
        {
            get { return _standardCommand; }
        }

        public ICommand DropFrameCommand
        {
            get { return _dropFrameCommand; }
        }

        public ICommand ConflateCommand
        {
            get { return _conflateCommand; }
        }

        public ICommand ConstantRateCommand
        {
            get { return _constantRateCommand; }
        }

        public ICommand AsyncCommand
        {
            get { return _asyncCommand; }
        }

        public ICommand SyncCommand
        {
            get { return _syncCommand; }
        }

        public SpotTileSubscriptionMode SubscriptionMode { get; private set; }

        public SpotTileExecutionMode ExecutionMode { get; private set; }

        private void Execute(SpotTileSubscriptionMode spotTileSubscriptionMode)
        {
            SubscriptionMode = spotTileSubscriptionMode;
            RaiseCanExecuteChanged();
        }

        private bool CanExecute(SpotTileSubscriptionMode spotTileSubscriptionMode)
        {
            return SubscriptionMode != spotTileSubscriptionMode;
        }

        private void Execute(SpotTileExecutionMode spotTileExecutionMode)
        {
            ExecutionMode = spotTileExecutionMode;
            RaiseCanExecuteChanged();
        }

        private bool CanExecute(SpotTileExecutionMode spotTileExecutionMode)
        {
            return ExecutionMode != spotTileExecutionMode;
        }

        private void RaiseCanExecuteChanged()
        {
            _standardCommand.RaiseCanExecuteChanged();
            _dropFrameCommand.RaiseCanExecuteChanged();
            _conflateCommand.RaiseCanExecuteChanged();
            _constantRateCommand.RaiseCanExecuteChanged();
            _asyncCommand.RaiseCanExecuteChanged();
            _syncCommand.RaiseCanExecuteChanged();
        }
    }
}