using System;
using System.Collections.Generic;
using WampSharp.Core.Serialization;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.PubSub;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class WampSubscriber : IWampRawTopicClientSubscriber
    {
        private readonly Action<dynamic> _callback;

        public WampSubscriber(Action<dynamic> callback)
        {
            _callback = callback;
        }

        public void Event<TMessage>(IWampFormatter<TMessage> formatter, long publicationId, EventDetails details)
        {
            Console.WriteLine("received response with no arguments");
            _callback(null);
        }

        public void Event<TMessage>(IWampFormatter<TMessage> formatter, long publicationId, EventDetails details, TMessage[] arguments)
        {
            _callback(arguments);
        }

        public void Event<TMessage>(IWampFormatter<TMessage> formatter, long publicationId, EventDetails details, TMessage[] arguments,
            IDictionary<string, TMessage> argumentsKeywords)
        {
            _callback(arguments);
        }
    }
}