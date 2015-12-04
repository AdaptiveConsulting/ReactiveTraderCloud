using System;
using System.Text;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.EventStore.Connection;
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

        public static IObservable<IConnected<IEventStoreConnection>> GetEventStoreConnectedStream(this ConnectionStatusMonitor monitor, IEventStoreConnection connection)
        {
            return monitor.ConnectionInfoChanged.Where(x => x.Status == ConnectionStatus.Connected ||
                                                            x.Status == ConnectionStatus.Disconnected)
                          .Select(c => c.Status == ConnectionStatus.Connected
                              ? Connected.Yes(connection)
                              : Connected.No<IEventStoreConnection>());
        }
    }
}