using System;
using Common.Logging;

namespace Adaptive.ReactiveTrader.MessageBroker
{
    public class MessageBrokerLauncher
    {
        protected static readonly ILog Log = LogManager.GetLogger<MessageBrokerLauncher>();

        public static IDisposable Run()
        {
           Log.Info("Message Broker Starting...");

            var broker = new MessageBroker();
            broker.Start();

            return broker;
        }
    }
}