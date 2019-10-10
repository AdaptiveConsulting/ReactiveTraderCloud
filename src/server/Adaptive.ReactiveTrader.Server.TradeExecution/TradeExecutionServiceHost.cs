using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Newtonsoft.Json;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    internal class TradeExecutionServiceHost : ServiceHostBase
    {
        //private new static readonly ILogger Log = Log.ForContext<TradeExecutionServiceHost>();
        private readonly ITradeExecutionService _service;

        public TradeExecutionServiceHost(ITradeExecutionService service, IBroker broker) : base(broker, "execution")
        {
            _service = service;
            RegisterCallResponse("executeTrade", ExecuteTrade);
            StartHeartBeat();
        }

        public Task<ExecuteTradeResponseDto> ExecuteTrade(IRequestContext context, IMessage message)
        {
            Log.Debug("Received ExecuteTrade from {username}", context.UserSession.Username);

            var payload = JsonConvert.DeserializeObject<ExecuteTradeRequestDto>(Encoding.UTF8.GetString(message.Payload));
            
            Log.Information("Received Trade Execution request {trade}", JsonConvert.SerializeObject(payload));

            return _service.ExecuteTrade(context, payload);
        }
    }
}