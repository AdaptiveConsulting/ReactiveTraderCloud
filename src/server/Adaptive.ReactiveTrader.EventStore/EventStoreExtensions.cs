using System;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Text;
using EventStore.ClientAPI;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.EventStore
{
    public static class EventStoreExtensions
    {
        public static IObservable<IEvent> GetAllEvents(this IEventStore es, IScheduler scheduler, Action<EventStoreCatchUpSubscription> onCaughtUp)
        {
            return Observable.Create<IEvent>(o =>
            {
                Action<IEvent> onEvent = e =>
                {
                    scheduler.Schedule(() =>
                    {
                        o.OnNext(e);
                    });
                };

                var subscription = es.SubscribeToAllFrom(Position.Start, false, onEvent, onCaughtUp);
                return new CompositeDisposable(Disposable.Create(() => subscription.Stop()));
            });
        }
        public static T GetEvent<T>(this IEvent evt)
        {
            var eventString = Encoding.UTF8.GetString(evt.Data);
            return JsonConvert.DeserializeObject<T>(eventString);
        }
    }
}
