using System;
using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    internal class TradeExecutionServiceHost : ServiceHostBase
    {
        private static readonly ILog Log = LogManager.GetLogger<TradeExecutionServiceHost>();
        private readonly ITradeExecutionService _service;
        private readonly IBroker _broker;

        public TradeExecutionServiceHost(ITradeExecutionService service, IBroker broker) : base(broker, "execution")
        {
            _service = service;
            _broker = broker;
        }

        public override async Task Start()
        {
            await _broker.RegisterCallResponse("execution.ExecuteTrade", ExecuteTrade);
            Console.WriteLine("procedure execution.ExecuteTrade() registered");
        }

        public Task<ExecuteTradeResponseDto> ExecuteTrade(IRequestContext context, IMessage message)
        {
            if (Log.IsDebugEnabled)
            {
                Log.DebugFormat("Received ExecuteTrade from {0}", context.UserSession.Username);
            }

            var payload = JsonConvert.DeserializeObject<ExecuteTradeRequestDto>(Encoding.UTF8.GetString(message.Payload));

            return _service.ExecuteTrade(context, payload);
        }
    }
}