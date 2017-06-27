using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Client.Android.Extentions;
using Adaptive.ReactiveTrader.Client.Concurrency;
using Adaptive.ReactiveTrader.Client.UI.SpotTiles;
using Adaptive.ReactiveTrader.Shared.Extensions;
using Android.Content;
using Android.Runtime;
using Android.Support.V7.Widget;
using Android.Text;
using Android.Views;
using Android.Views.Animations;
using Android.Views.InputMethods;
using Android.Widget;
using OxyPlot;
using OxyPlot.Axes;
using OxyPlot.Series;
using OxyPlot.Xamarin.Android;

namespace Adaptive.ReactiveTrader.Client.Android.UI.SpotTiles
{
    public class SpotTileViewHolder : RecyclerView.ViewHolder, IDisposable
    {
        const int GraphLimit = 100;
        PlotModel _plotModel;
        AreaSeries _areaSeries;
        private readonly CompositeDisposable _allSubscriptions = new CompositeDisposable();
        private CancellationTokenSource _cancelAnimationSource = new CancellationTokenSource();
        private readonly List<decimal> _historicalPrices = new List<decimal>();

        TextView CurrencyPairLabel { get; set; }
        PriceButton BidButton { get; set; }
        PriceButton AskButton { get; set; }
        TextView SpreadLabel { get; set; }
        DirectionArrow UpArrow { get; set; }
        DirectionArrow DownArrow { get; set; }
        TextView DealtCurrencyLabel { get; set; }
        EditText NotionalTextBox { get; set; }
        TextView SpotDateLabel { get; set; }
        LinearLayout Content { get; set; }
        CardView CardView { get; set; }
        ViewAnimator ViewAnimator { get; set; }
        PlotView PlotView { get; set; }
        LinearLayout PriceNotAvailableOverlay { get; set; }

        public SpotTileViewHolder(IntPtr javaReference, JniHandleOwnership jniHandleOwnership)
            : base(javaReference, jniHandleOwnership)
        {
            Setup(ItemView);
        }

        public SpotTileViewHolder(View itemView)
            : base(itemView)
        {
            Setup(itemView);
        }

        void Setup(View itemView)
        { 
            CurrencyPairLabel = itemView.FindViewById<TextView>(Resource.Id.SpotTileCurrencyPairTextView);
            BidButton = itemView.FindViewById<PriceButton>(Resource.Id.SpotTileBidPriceButton);
            AskButton = itemView.FindViewById<PriceButton>(Resource.Id.SpotTileAskPriceButton);
            SpreadLabel = itemView.FindViewById<TextView>(Resource.Id.SpotTileSpreadTextView);
            UpArrow = itemView.FindViewById<DirectionArrow>(Resource.Id.SpotTileUpArrow);
            DownArrow = itemView.FindViewById<DirectionArrow>(Resource.Id.SpotTileDownArrow);
            DealtCurrencyLabel = itemView.FindViewById<TextView>(Resource.Id.SpotTileDealtCurrencyTextView);
            NotionalTextBox = itemView.FindViewById<EditText>(Resource.Id.SpotTileNotionalEditText);
            SpotDateLabel = itemView.FindViewById<TextView>(Resource.Id.SpotTileSpotDateTextView);
            Content = itemView.FindViewById<LinearLayout>(Resource.Id.SpotTileContent);
            CardView = itemView.FindViewById<CardView>(Resource.Id.CardView);
            ViewAnimator = itemView.FindViewById<ViewAnimator>(Resource.Id.ViewAnimator);
            PlotView = itemView.FindViewById<PlotView>(Resource.Id.plotView);
            PriceNotAvailableOverlay = itemView.FindViewById<LinearLayout>(Resource.Id.PriceNotAvailableOverlay);

            CardView.PreventCornerOverlap = false;
            CardView.Radius = 5;
            NotionalTextBox.EditorAction += (sender, args) =>
            {
                if (args.ActionId == ImeAction.Done)
                {
                    NotionalTextBox.ClearFocus();
                    HideKeyboard(NotionalTextBox);
                }
            };

            _plotModel = new PlotModel
            {
                PlotAreaBorderThickness = new OxyThickness(0),
                PlotAreaBorderColor = OxyColor.FromRgb(46, 59, 75)
            };
            _plotModel.Axes.Add(new LinearAxis { Position = AxisPosition.Left, IsAxisVisible = false, MaximumPadding = 0, MinimumPadding = 0, IsPanEnabled = false, IsZoomEnabled = false });
            _plotModel.Axes.Add(new LinearAxis { Position = AxisPosition.Bottom, IsAxisVisible = false, MaximumPadding = 0, MinimumPadding = 0, IsPanEnabled = false, IsZoomEnabled = false });

            _areaSeries = new AreaSeries {LineStyle = LineStyle.Solid, Color = OxyColor.FromRgb(46, 59, 75)};
            _plotModel.Series.Add(_areaSeries);
            _plotModel.Background = OxyColor.FromRgb(33, 42, 53);
            PlotView.Model = _plotModel;
            PlotView.OverScrollMode = OverScrollMode.Never;
            PlotView.ScrollBarSize = 0;
            PlotView.HorizontalScrollBarEnabled = false;
            PlotView.VerticalScrollBarEnabled = false;
        }

        public void Bind(ISpotTileViewModel spotTileViewModel, IConcurrencyService concurrencyService)
        {
            var stopwatch = new Stopwatch();
            stopwatch.Start();
            _allSubscriptions.Clear();

            concurrencyService.Dispatcher.Schedule(() =>
            {
                if (spotTileViewModel.State == TileState.Affirmation)
                {
                    spotTileViewModel.DismissAffirmation();
                }

                Reset();
                CurrencyPairLabel.Text = spotTileViewModel.Pricing.Symbol;
                BidButton.SetDataContext(spotTileViewModel.Pricing.Bid);
                AskButton.SetDataContext(spotTileViewModel.Pricing.Ask);
                SetHistoricPrices(spotTileViewModel.Pricing.HistoricalMid);
            });

            _allSubscriptions.Add(spotTileViewModel.Pricing.Bid
                .ObserveProperty(vm => vm.IsExecuting, false)
                .ObserveOn(concurrencyService.Dispatcher)
                .Subscribe(s => AskButton.SetEnabledOverride(!s)));

            _allSubscriptions.Add(spotTileViewModel.Pricing.Ask
			                      .ObserveProperty(vm => vm.IsExecuting, false)
                .ObserveOn(concurrencyService.Dispatcher)
                .Subscribe(s => BidButton.SetEnabledOverride(!s)));

			_allSubscriptions.Add(spotTileViewModel.Pricing.ObserveProperty(vm => vm.Spread, false)
                .ObserveOn(concurrencyService.Dispatcher)
                .Subscribe(s => SpreadLabel.Text = s));

			_allSubscriptions.Add(spotTileViewModel.Pricing.ObserveProperty(vm => vm.DealtCurrency, false)
                .ObserveOn(concurrencyService.Dispatcher)
                .Subscribe(s => DealtCurrencyLabel.Text = s));

			_allSubscriptions.Add(spotTileViewModel.Pricing.ObserveProperty(vm => vm.SpotDate, false)
                .ObserveOn(concurrencyService.Dispatcher)
                .Subscribe(s => SpotDateLabel.Text = s));

			_allSubscriptions.Add(spotTileViewModel.Pricing.ObserveProperty(vm => vm.Mid, false)
                .ObserveOn(concurrencyService.Dispatcher)
                .Subscribe(AddPrice));

            _allSubscriptions.Add(spotTileViewModel.Pricing.ObserveProperty(vm => vm.IsStale)
                .ObserveOn(concurrencyService.Dispatcher)
                .Subscribe(SetIsStale));

            // two way bind the notional
            _allSubscriptions.Add(spotTileViewModel.Pricing.ObserveProperty(vm => vm.Notional, true)
                .Where(n => n != NotionalTextBox.Text)
                .ObserveOn(concurrencyService.Dispatcher)
                .Subscribe(s => NotionalTextBox.Text = s));

            _allSubscriptions.Add(NotionalTextBox
                .TextChangedStream()
                .Where(_ => spotTileViewModel.Pricing.Notional != NotionalTextBox.Text)
                .ObserveOn(concurrencyService.Dispatcher)
                .Subscribe(_ =>
                {
                    spotTileViewModel.Pricing.Notional = NotionalTextBox.Text;
                }));

            _allSubscriptions.Add(spotTileViewModel.Pricing.ObserveProperty(vm => vm.Movement, true)
                .ObserveOn(concurrencyService.Dispatcher)
                .Subscribe(m =>
                {
                    UpArrow.Visibility = m == PriceMovement.Up ? ViewStates.Visible : ViewStates.Invisible;
                    DownArrow.Visibility = m == PriceMovement.Down ? ViewStates.Visible : ViewStates.Invisible;
                }));

            _allSubscriptions.Add(spotTileViewModel.ObserveProperty(vm => vm.State, true)
                .Where(m => m == TileState.Affirmation)
                .SubscribeOn(concurrencyService.TaskPool)
                .Subscribe(async m =>
                {
                    try
                    {
                        _cancelAnimationSource = new CancellationTokenSource();
                        ShowAffirmation(spotTileViewModel.Affirmation);
                        await Task.Delay(4000, _cancelAnimationSource.Token);
                    }
                    catch (TaskCanceledException)
                    {
                        /* Animation was cancelled */
                    }
                    finally
                    {
                        spotTileViewModel.DismissAffirmation();
                    }
                }));

            _allSubscriptions.Add(spotTileViewModel.ObserveProperty(vm => vm.State, true)
                .Where(m => m == TileState.Pricing)
                .SubscribeOn(concurrencyService.TaskPool)
                .Subscribe(_ => ShowPricing()));
        }

        public void Unbind()
        {
            _allSubscriptions.Clear();
        }

        public void AnimateIn(int position)
        {
            CardView.ScaleY = 0;
            CardView.ScaleX = 0;
            CardView
                .Animate()
                .SetStartDelay(position * 200)
                .ScaleX(1).ScaleY(1)
                .SetDuration(450)
                .SetInterpolator(new OvershootInterpolator(3))
                .WithLayer()
                .Start();
        }

        private void SetHistoricPrices(decimal[] prices)
        {
            ResetChart();

            if (!prices.Any())
            {
                return;
            }

            _historicalPrices.AddRange(prices);
            DrawChart();
        }

        private void AddPrice(decimal price)
        {
            if (price == 0)
            {
                return;
            }

            _historicalPrices.Add(price);

            if (_historicalPrices.Count > GraphLimit)
            {
                _historicalPrices.RemoveAt(0);
            }

            DrawChart();
        }

        private void ResetChart()
        {
            _historicalPrices.Clear();
            DrawChart();
        }

        private void DrawChart()
        {
            _areaSeries.Points.Clear();
            _areaSeries.Points2.Clear();

            if (!_historicalPrices.Any())
            {
                _plotModel.InvalidatePlot(true);
                return;
            }

            for (int i = 0; i < _historicalPrices.Count; i++)
            {
                _areaSeries.Points.Add(new DataPoint(i, (double)_historicalPrices[i]));
            }

            // We need to set Points2 for the chart to fill in properly
            var min = _areaSeries.Points.Min(p => p.Y);
            _areaSeries.Points2.AddRange(_areaSeries.Points.Select(p => new DataPoint(p.X, min)));
            _plotModel.InvalidatePlot(true);
        }

        private void ShowAffirmation(ISpotTileAffirmationViewModel vm)
        {
            if (IsShowingAffirmation)
            {
                return;
            }

            HideKeyboard(NotionalTextBox);
            AnimationFactory.FlipTransition(ViewAnimator, FlipDirection.LeftRight, 200);

            ItemView.FindViewById<TextView>(Resource.Id.ConfirmDirectionTextView).Text = vm.Direction == Domain.Models.Direction.BUY ? "Bought" : "Sold";
            ItemView.FindViewById<TextView>(Resource.Id.ConfirmCurrencyPairTextView).Text = vm.CurrencyPair;
            ItemView.FindViewById<TextView>(Resource.Id.ConfirmNotionalTextView).Text = $"{vm.Notional:N0} {vm.DealtCurrency}";
            ItemView.FindViewById<TextView>(Resource.Id.ConfirmSpotRateTextView).Text = vm.SpotRate.ToString(CultureInfo.InvariantCulture);
            ItemView.FindViewById<TextView>(Resource.Id.ConfirmStatusTextView).Text = vm.Rejected;
            ItemView.FindViewById<TextView>(Resource.Id.ConfirmTradeIdTextView).Text = vm.TradeId.ToString();
        }

        private void Reset()
        {
            ViewAnimator.InAnimation = null;
            ViewAnimator.OutAnimation = null;
            ViewAnimator.DisplayedChild = 0;
            AskButton.Selected = false;
            AskButton.Pressed = false;
            BidButton.Selected = false;
            BidButton.Pressed = false;
            ResetChart();
            SetIsStale(false);
        }

        private bool IsShowingAffirmation => ViewAnimator.CurrentView.Id == Resource.Id.CardViewBack;


        private void SetIsStale(bool isStale)
        {
            if (isStale)
            {
                PriceNotAvailableOverlay.Visibility = ViewStates.Visible;
                Content.Visibility = ViewStates.Invisible;
            }
            else
            {
                PriceNotAvailableOverlay.Visibility = ViewStates.Invisible;
                Content.Visibility = ViewStates.Visible;
            }
        }

        private void ShowPricing()
        {
            if (!IsShowingAffirmation)
            {
                return;
            }

            NotionalTextBox.ClearFocus();

            AnimationFactory.FlipTransition(ViewAnimator, FlipDirection.LeftRight, 200);
        }

        static void HideKeyboard(View view)
        {
            var service = (InputMethodManager)view.Context.GetSystemService(Context.InputMethodService);
            service.HideSoftInputFromWindow(view.WindowToken, 0);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _allSubscriptions.Dispose();
            }

            base.Dispose(disposing);
        }
    }
}