namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    public enum SpotTileSubscriptionMode
    {
        OnDispatcher,
        ObserveLatestOnDispatcher,
        Conflate,
        ConstantRate
    }
}