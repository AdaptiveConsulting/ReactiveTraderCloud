using System.Text;
using EventStore.ClientAPI;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.EventStore
{
    public static class EventStoreExtensions
    {
        public static T GetEvent<T>(this RecordedEvent evt)
        {
            {
                var eventString = Encoding.UTF8.GetString(evt.Data);
                return JsonConvert.DeserializeObject<T>(eventString);
            }
        }
    }
}