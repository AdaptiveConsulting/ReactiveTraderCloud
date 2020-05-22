using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Newtonsoft.Json;
using Serilog;
using Serilog.Context;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    internal class TradeExecutionServiceHost : ServiceHostBase
    {
        private readonly ITradeExecutionService _service;

        public TradeExecutionServiceHost(ITradeExecutionService service, IBroker broker) : base(broker, "execution")
        {
            _service = service;
            RegisterCallResponse("executeTrade", ExecuteTrade);
            StartHeartBeat();

            LogContext.PushProperty("InstanceId", InstanceId);
        }

        protected Task<ExecuteTradeResponseDto> ExecuteTrade(IRequestContext context, IMessage message)
        {
            using (LogContext.PushProperty("InstanceId", InstanceId))
            {
                Log.Debug("Received ExecuteTrade from {username}", context.Username);

                var payload = JsonConvert.DeserializeObject<ExecuteTradeRequestDto>(Encoding.UTF8.GetString(message.Payload));

                Log.Information("Received Trade Execution request {trade}", JsonConvert.SerializeObject(payload));

                return _service.ExecuteTrade(context, payload);
            }
        }
    }
}
