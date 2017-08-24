using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Concurrency;
using Adaptive.ReactiveTrader.Client.Domain;
using Adaptive.ReactiveTrader.Client.Domain.Instrumentation;
using Adaptive.ReactiveTrader.Client.Domain.Transport;
using Adaptive.ReactiveTrader.Shared.Logging;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.Connectivity
{
    public class ConnectivityStatusViewModel : ViewModelBase, IConnectivityStatusViewModel, IDisposable
    {
        private static readonly TimeSpan StatsFrequency = TimeSpan.FromSeconds(1);
        
        private readonly IProcessorMonitor _processorMonitor;
        private readonly IPriceLatencyRecorder _priceLatencyRecorder;
        private readonly CompositeDisposable _subscriptions = new CompositeDisposable();

        public ConnectivityStatusViewModel(
            IReactiveTrader reactiveTrader, 
            IConcurrencyService concurrencyService, 
            ILoggerFactory loggerFactory,
            IProcessorMonitor processorMonitor)
        {
            _processorMonitor = processorMonitor;
            _priceLatencyRecorder = reactiveTrader.PriceLatencyRecorder;
            var log = loggerFactory.Create(typeof (ConnectivityStatusViewModel));

            if (!_processorMonitor.IsAvailable)
            {
                CpuPercent = "N/A";
                CpuTime = "N/A";
            }

            _subscriptions.Add(reactiveTrader.ConnectionStatusStream
                .ObserveOn(concurrencyService.Dispatcher)
                .SubscribeOn(concurrencyService.TaskPool)
                .Subscribe(
                OnStatusChange,
                ex => log.Error("An error occurred within the connection status stream.", ex)));

            _subscriptions.Add(Observable
                .Interval(StatsFrequency, concurrencyService.Dispatcher)
                .Subscribe(_ => OnTimerTick()));
        }

        public void Dispose()
        {
            _subscriptions.Dispose();
        }

        private void OnTimerTick()
        {
            var stats = _priceLatencyRecorder.CalculateAndReset();
            
            if (stats == null)
                return;

            UiLatency = stats.UiLatencyMax;
            UiUpdates = stats.RenderedCount;
            TicksReceived = stats.ReceivedCount;
            
            Histogram = stats.Histogram;

            if (!Disconnected && Server != null && Server.Contains("localhost"))
            {
                ServerClientLatency = stats.ServerLatencyMax + "ms";
                TotalLatency = stats.TotalLatencyMax + "ms";
            }
            else
            {
                ServerClientLatency = "N/A";
                TotalLatency = "N/A";
            }

            if (_processorMonitor.IsAvailable)
            {
                var cpuTime = _processorMonitor.CalculateProcessingAndReset();
                CpuTime = Math.Round(cpuTime.TotalMilliseconds, 0).ToString();
                CpuPercent = Math.Round(cpuTime.TotalMilliseconds / (Environment.ProcessorCount * StatsFrequency.TotalMilliseconds) * 100, 0).ToString();
            }
        }

        private void OnStatusChange(ConnectionInfo connectionInfo)
        {
            Server = connectionInfo.Server;
            TransportName = connectionInfo.TransportName;

            switch (connectionInfo.ConnectionStatus)
            {
                case ConnectionStatus.Uninitialized:
                case ConnectionStatus.Connecting:
                    Status = "Connecting...";
                    Disconnected = true;
                    break;
                case ConnectionStatus.Connected:
                    Status = "All Services Connected";
                    Disconnected = false;
                    break;
                case ConnectionStatus.PartiallyConnected:
                    Status = "Some Services Disconnected";
                    Disconnected = false;
                    break;
                case ConnectionStatus.Closed:
                    Status = "Disconnected";
                    Disconnected = true;
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public string Status { get; private set; }
        public string Server { get; private set; }
        public bool Disconnected { get; private set; }
        public long UiUpdates { get; private set; }
        public long TicksReceived { get; private set; }
        public string TotalLatency { get; private set; }
        public string ServerClientLatency { get; private set; }
        public long UiLatency { get; private set; }
        public string TransportName { get; private set; }
        public string Histogram { get; private set; }
        public string CpuTime { get; private set; }
        public string CpuPercent { get; private set; }
    }
}