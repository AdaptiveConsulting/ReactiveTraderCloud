using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class ReferenceWriteServiceHost : ServiceHostBase
    {
        private const string ActivateCurrencyPairProcedureName = "activateCurrencyPair";
        private const string DeactivateCurrencyPairProcedureName = "deactivateCurrencyPair";

        private readonly ReferenceWriteService _service;

        public ReferenceWriteServiceHost(ReferenceWriteService service, IBroker broker) : base(broker, "reference")
        {
            _service = service;

            RegisterCall(ActivateCurrencyPairProcedureName, ActivateCurrencyPair);
            RegisterCall(DeactivateCurrencyPairProcedureName, DeactivateCurrencyPair);
            StartHeartBeat();
        }

        private Task ActivateCurrencyPair(IRequestContext context, IMessage message)
        {
            var payload =
                JsonConvert.DeserializeObject<ActivateCurrencyPairRequestDto>(Encoding.UTF8.GetString(message.Payload));

            return _service.ActivateCurrencyPair(context, payload);
        }

        private Task DeactivateCurrencyPair(IRequestContext context, IMessage message)
        {
            var payload =
                JsonConvert.DeserializeObject<DeactivateCurrencyPairRequestDto>(Encoding.UTF8.GetString(message.Payload));
            return _service.DeactivateCurrencyPair(context, payload);
        }
    }
}