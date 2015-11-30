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

        public TradeExecutionServiceHost(ITradeExecutionService service, IBroker broker) : base(broker, "execution")
        {
            _service = service;
        }
       
        public override Task Start()
        {
            RegisterCallResponse("executeTrade", ExecuteTrade);
            return base.Start();
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