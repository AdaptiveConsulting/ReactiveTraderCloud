using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Concurrency;
using Adaptive.ReactiveTrader.Client.Domain;
using Android.OS;
using Android.Views;
using Android.Widget;
using Fragment = Android.Support.V4.App.Fragment;

namespace Adaptive.ReactiveTrader.Client.Android.UI.Status
{
    public class StatusFragment : Fragment
    {
        private readonly IReactiveTrader _reactiveTrader;
        private readonly CompositeDisposable _disposables = new CompositeDisposable();
        private ConnectionInfo _lastConnectionInfo;

        public StatusFragment() // Required by Android SDK
        {
        }

        public StatusFragment(IReactiveTrader reactiveTrader, IConcurrencyService concurrencyService)
        {
            _reactiveTrader = reactiveTrader;

            _disposables.Add(
                _reactiveTrader.ConnectionStatusStream
                    .SubscribeOn(concurrencyService.TaskPool)
                    .ObserveOn(concurrencyService.Dispatcher)
                    .Subscribe(OnStatusChange));

            _disposables.Add(
                Observable.Interval(TimeSpan.FromSeconds(1), concurrencyService.TaskPool)
                    .ObserveOn(concurrencyService.Dispatcher)
                    .Subscribe(_ => OnTimer()));
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            // Use this to return your custom view for this Fragment
            var view = inflater.Inflate(Resource.Layout.Status, container, false);

            view.FindViewById<TextView>(Resource.Id.traderId).Text = App.Username;

            if (_lastConnectionInfo != null)
            {
                OnStatusChange(_lastConnectionInfo);
                _lastConnectionInfo = null;
            }

            return view;
        }
        
        private void OnStatusChange(ConnectionInfo connectionInfo)
        {
            if (View != null)
            {
                //View.FindViewById<TextView>(Resource.Id.server).Text = connectionInfo.Server;
                //View.FindViewById<TextView>(Resource.Id.status).Text = connectionInfo.ConnectionStatus.ToString();
            }
            else
            {
                _lastConnectionInfo = connectionInfo;
            }
        }

        private void OnTimer()
        {
            var statistics = _reactiveTrader.PriceLatencyRecorder.CalculateAndReset();

            if (View != null)
            {
                View.FindViewById<TextView>(Resource.Id.serverUpdates).Text = $"{statistics.ReceivedCount} / sec";
                View.FindViewById<TextView>(Resource.Id.uiUpdates).Text = $"{statistics.RenderedCount} / sec";
                View.FindViewById<TextView>(Resource.Id.uiLatency).Text = $"{statistics.RenderedCount} ms";
            }
        }
    }
}