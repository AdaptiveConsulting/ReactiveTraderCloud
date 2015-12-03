using System;
using System.Collections.Generic;
using WampSharp.Core.Serialization;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.Rpc;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class RpcCallback : IWampRawRpcOperationClientCallback
    {
        private readonly Action _successCallback;

        public RpcCallback(Action successCallback)
        {
            _successCallback = successCallback;
        }

        public void Result<TMessage>(IWampFormatter<TMessage> formatter, ResultDetails details)
        {
            _successCallback();
        }

        public void Result<TMessage>(IWampFormatter<TMessage> formatter, ResultDetails details, TMessage[] arguments)
        {
            _successCallback();
        }

        public void Error<TMessage>(IWampFormatter<TMessage> formatter, TMessage details, string error)
        {
            Console.WriteLine("response 3");
            throw new Exception("Execute Trade error: " + error);
        }

        public void Error<TMessage>(IWampFormatter<TMessage> formatter, TMessage details, string error, TMessage[] arguments)
        {
            Console.WriteLine("response 4");
            throw new Exception("Execute Trade error: " + error);
        }

        public void Error<TMessage>(IWampFormatter<TMessage> formatter, TMessage details, string error, TMessage[] arguments,
            TMessage argumentsKeywords)
        {
            Console.WriteLine("response 5");
            throw new Exception("Execute Trade error: " + error);
        }

        public void Result<TMessage>(IWampFormatter<TMessage> formatter, ResultDetails details, TMessage[] arguments,
            IDictionary<string, TMessage> argumentsKeywords)
        {
            _successCallback();
        }
    }
}