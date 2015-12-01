using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.Messaging;
using System;
using Adaptive.ReactiveTrader.Server.Common;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new TradeExecutionServiceHostFactory());
        }
    }
}
