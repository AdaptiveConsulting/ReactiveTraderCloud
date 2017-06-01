using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Disposables;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using EventStore.ClientAPI;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.EventStore.EventHandling
{
    public class EventDispatcher : IEventDispatcher, IDisposable
    {
        private readonly IEventStoreConnection _eventStoreConnection;
        private readonly EventTypeResolver _eventTypeResolver;

        public EventDispatcher(IEventStoreConnection eventStoreConnection, EventTypeResolver eventTypeResolver)
        {
            _eventStoreConnection = eventStoreConnection;
            _eventTypeResolver = eventTypeResolver;
        }

        public void Dispose()
        {
            // Nothing to to
            // TODO - confirm this - should we kill all created subscriptions?
        }

        public Task<IDisposable> Start(string streamName, string groupName, params IEventHandler[] eventHandlers)
        {
            return Start(streamName, groupName, eventHandlers.AsEnumerable());
        }

        public async Task<IDisposable> Start(string streamName, string groupName, IEnumerable<IEventHandler> eventHandlers)
        {
            // TODO - consider usage of async lambda here.
            var subscription = await _eventStoreConnection.ConnectToPersistentSubscriptionAsync(
                stream: streamName,
                groupName: groupName,
                eventAppeared: async (s, e) => await OnEventAppeared(s, e, eventHandlers),
                subscriptionDropped: OnSubscriptionDropped,
                autoAck: false).ConfigureAwait(false);

            // TODO - consider the blocking timeout here, and where the timeout should come from.
            return Disposable.Create(() => subscription.Stop(TimeSpan.FromSeconds(10)));
        }

        private async Task OnEventAppeared(EventStorePersistentSubscriptionBase subscription,
                                           ResolvedEvent resolvedEvent,
                                           IEnumerable<IEventHandler> eventHandlers)
        {
            object deserialisedEvent;

            try
            {
                deserialisedEvent = DeserialiseEvent(resolvedEvent.Event);
            }
            catch (Exception ex)
            {
                // Failed to deserialise. Park this event.
                subscription.Fail(resolvedEvent,
                                  PersistentSubscriptionNakEventAction.Park,
                                  $"Failed to deserialise. Error: {ex.Message}");
                return;
            }

            var eventType = deserialisedEvent.GetType();
            var eventHandlerType = typeof(IEventHandler<>).MakeGenericType(eventType);
            var matchingHandlers = eventHandlers.Where(x => eventHandlerType.IsInstanceOfType(x)).ToList();

            if (matchingHandlers.Count == 0)
            {
                // No matching event handler found. Skip this event.
                subscription.Fail(resolvedEvent,
                                  PersistentSubscriptionNakEventAction.Skip,
                                  "Event handler not found");

                return;
            }

            try
            {
                foreach (var eventHandler in matchingHandlers)
                {
                    Task task = ((dynamic)eventHandler).Handle((dynamic)deserialisedEvent);
                    await task;
                }

                // All handlers successfully handled this event. Mark it as acknowledged.   
                subscription.Acknowledge(resolvedEvent);
            }
            catch (Exception ex)
            {
                // A handler unexpectedly failed. Park this event.
                subscription.Fail(resolvedEvent, PersistentSubscriptionNakEventAction.Park, ex.Message);
            }
        }

        private void OnSubscriptionDropped(EventStorePersistentSubscriptionBase subscription,
                                           SubscriptionDropReason reason,
                                           Exception exception)
        {
            // TODO - what to do here?
        }

        private object DeserialiseEvent(RecordedEvent evt)
        {
            var targetType = _eventTypeResolver.GetTypeForEventName(evt.EventType);
            var json = Encoding.UTF8.GetString(evt.Data);
            return JsonConvert.DeserializeObject(json, targetType);
        }
    }
}