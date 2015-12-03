using System;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Core;
using Common.Logging;
using Common.Logging.Simple;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class Program
    {
        public static void Main(string[] args)
        {
            App.Run(args, new AnalyticsServiceHostFactory());
        }
    }
}
