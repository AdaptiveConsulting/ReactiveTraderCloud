using System.Threading.Tasks;
using WampSharp.V2.Rpc;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public interface IRequestStream
    {
        [WampProcedure("reference.subscribe")]
        Task Subscribe(string queueName);
    }
}