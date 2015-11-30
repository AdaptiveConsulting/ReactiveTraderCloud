using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Newtonsoft.Json;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class RefDataWriteServiceHost : ServiceHostBase
    {
        private static readonly ILog Log = LogManager.GetLogger<RefDataWriteServiceHost>();
        private static readonly string ActivateCurrencyPairProcedureName = "refdatawrite.ActivateCurrencyPair";
        private static readonly string DeactivateCurrencyPairProcedureName = "refdatawrite.DeactivateCurrencyPair";

        private readonly RefDataWriteService _service;
        private readonly IBroker _broker;

        public RefDataWriteServiceHost(RefDataWriteService service, IBroker broker) : base(broker, "refWrite")
        {
            _service = service;
            _broker = broker;
        }

        public override async Task Start()
        {
            await _broker.RegisterCall(ActivateCurrencyPairProcedureName, ActivateCurrencyPair);
            await _broker.RegisterCall(DeactivateCurrencyPairProcedureName, DeactivateCurrencyPair);
        }

        private Task ActivateCurrencyPair(IRequestContext context, IMessage message)
        {

            var payload = JsonConvert.DeserializeObject<ActivateCurrencyPairRequestDto>(Encoding.UTF8.GetString(message.Payload));

            return _service.ActivateCurrencyPair(context, payload);
        }

        private Task DeactivateCurrencyPair(IRequestContext context, IMessage message)
        {
            var payload = JsonConvert.DeserializeObject<DeactivateCurrencyPairRequestDto>(Encoding.UTF8.GetString(message.Payload));
            return _service.DeactivateCurrencyPair(context, payload);
        }

        public override void Dispose()
        {
            Log.Info("Dispose()");
            base.Dispose();
        }
    }
}