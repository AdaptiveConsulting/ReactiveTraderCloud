using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Common.Logging;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    internal class TradeExecutionServiceHost : ServiceHostBase
    {
        private new static readonly ILog Log = LogManager.GetLogger<TradeExecutionServiceHost>();
        private readonly ITradeExecutionService _service;

        public TradeExecutionServiceHost(ITradeExecutionService service, IBroker broker) : base(broker, "execution")
        {
            _service = service;
            RegisterCallResponse("executeTrade", ExecuteTrade);
            StartHeartBeat();
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