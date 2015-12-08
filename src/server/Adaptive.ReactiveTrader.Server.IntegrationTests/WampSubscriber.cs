using System;
using System.Collections.Generic;
using Common.Logging;
using WampSharp.Core.Serialization;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.PubSub;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class WampSubscriber : IWampRawTopicClientSubscriber
    {
        protected static readonly ILog Log = LogManager.GetLogger<WampSubscriber>();

        private readonly Action<dynamic> _callback;

        public WampSubscriber(Action<dynamic> callback)
        {
            _callback = callback;
        }

        public void Event<TMessage>(IWampFormatter<TMessage> formatter, long publicationId, EventDetails details)
        {
            Log.Info("Callback overload 1");
            _callback(null);
        }

        public void Event<TMessage>(IWampFormatter<TMessage> formatter, long publicationId, EventDetails details, TMessage[] arguments)
        {
            Log.Info("Callback overload 2");
            _callback(arguments);
        }

        public void Event<TMessage>(IWampFormatter<TMessage> formatter, long publicationId, EventDetails details, TMessage[] arguments,
            IDictionary<string, TMessage> argumentsKeywords)
        {
            Log.Info("Callback overload 3");
            _callback(arguments);
        }
    }
}