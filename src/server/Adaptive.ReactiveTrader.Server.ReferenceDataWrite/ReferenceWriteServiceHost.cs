using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Newtonsoft.Json;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class ReferenceWriteServiceHost : ServiceHostBase
    {
        private static readonly ILog Log = LogManager.GetLogger<ReferenceWriteServiceHost>();
        private const string ActivateCurrencyPairProcedureName = "activateCurrencyPair";
        private const string DeactivateCurrencyPairProcedureName = "deactivateCurrencyPair";

        private readonly ReferenceWriteService _service;

        public ReferenceWriteServiceHost(ReferenceWriteService service, IBroker broker) : base(broker, "reference")
        {
            _service = service;
        }

        public override async Task Start()
        {
            RegisterCall(ActivateCurrencyPairProcedureName, ActivateCurrencyPair);
            RegisterCall(DeactivateCurrencyPairProcedureName, DeactivateCurrencyPair);

            await base.Start();
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

        public override void Dispose()
        {
            Log.Info("Dispose()");
            base.Dispose();
        }
    }
}