using System;
using Foundation;

namespace Adaptive.ReactiveTrader.Client.iOS.Shared
{
    public static class WormHoleConstants
    {
        public static string StartUpdates = "StartUpdates";
        public static string StopUpdates = "StopUpdates";

        public static string CurrencyUpdate = "CurrencyUpdate";
        public static string AppGroup = "group.com.weareadaptive.ReactiveTrader";
        public static string Directory = "wormhole";

        public static NSString TradeKey = new NSString("trade");
        public static NSString CurrencyPairKey = new NSString("currencyPair");
    }
}

