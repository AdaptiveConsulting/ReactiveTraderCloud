using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles.Designer
{
    public class DesignTimeSpotTilePricingViewModel :ViewModelBase, ISpotTilePricingViewModel
    {
        public DesignTimeSpotTilePricingViewModel()
        {
            Bid = new DesignTimeOneWayPriceViewModel(Direction.SELL, "1.23", "45", "6");
            Ask = new DesignTimeOneWayPriceViewModel(Direction.BUY, "1.23", "46", "7");
        }

        public void Dispose()
        {
        }

        public SpotTileSubscriptionMode SubscriptionMode { get; set; }
        public SpotTileExecutionMode ExecutionMode { get; set; }
        public string Symbol => "EUR / USD";
        public IOneWayPriceViewModel Bid { get; }
        public IOneWayPriceViewModel Ask { get; }

        public string Notional
        {
            get { return "1000000"; }
            set { }
        }
        public string Spread => "1.0";
        public string DealtCurrency => "EUR";
        public PriceMovement Movement => PriceMovement.Up;
        public string SpotDate => "SP. 9 Apr";
        public bool IsSubscribing { get; private set; }
        public bool IsStale => true;

        public void OnTrade(ITrade trade)
        {
        }

        public void OnExecutionError(string message)
        {
        }

        public decimal Mid => 5m;
        public decimal[] HistoricalMid => new decimal[0];
    }
}