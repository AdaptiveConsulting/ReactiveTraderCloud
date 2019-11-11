using System;
using System.Collections.Generic;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Runtime.Serialization;
using System.Threading;
using Serilog;

namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    internal class RequestStreamServer<TRequest, TUpdate> : RequestOperationServerBase,
        IRequestStreamServer<TRequest, TUpdate>
    {
        private readonly IMessageFactory _messageFactory;
        private readonly IPublisher _publisher;
        private readonly IScheduler _scheduler;
        private readonly ISerializer _serializer;
        private readonly string _serverId = Guid.NewGuid().ToString(); // TODO: pass in identifier generator?
        private readonly ISubscriber _subscriber;
        private readonly Dictionary<string, IDisposable> _subscriptions = new Dictionary<string, IDisposable>();
        private readonly TimeSpan _updateToLiveTime;

        public RequestStreamServer(ISubscriber subscriber,
                                   IPublisher publisher,
                                   IUserSessionCache userSessionCache,
                                   ISerializer serializer,
                                   IScheduler scheduler,
                                   IMessageFactory messageFactory,
                                   TimeSpan updateToLiveTime,
                                   bool isSessionRequired)
            : base(userSessionCache, isSessionRequired)
        {
            _subscriber = subscriber;
            _publisher = publisher;
            _serializer = serializer;
            _scheduler = scheduler;
            _messageFactory = messageFactory;
            _updateToLiveTime = updateToLiveTime;
        }

        public IDisposable Stream(RequestStreamHandler<TRequest, TUpdate> requestStreamHandler)
        {
            return _subscriber.Subscribe(
                message => _scheduler.Schedule(() =>
                {
                    var subscriptionId = message.Properties.GetString(RequestStreamKeys.SubscriptionId);
                    var kind = message.Properties.GetString(RequestStreamKeys.RequestKind);
                    if (kind == RequestKind.Subscription)
                    {
                        ProcessSubscription(subscriptionId, message, requestStreamHandler);
                    }
                    else if (kind == RequestKind.Unsubscription)
                    {
                        ProcessUnsubscription(subscriptionId);
                    }
                    else
                    {
                        Log.Warning("Unknown RequestStream RequestKind: '{requestKind}'", kind);
                    }
                }));
        }

        private void ProcessSubscription(string subscriptionId,
                                         IMessage message,
                                         RequestStreamHandler<TRequest, TUpdate> requestStreamHandler)
        {
            // In order to prevent races/resource-leaks here we must:
            //  * Monitor session diconnections before attempting to create a request context.
            //      - Otherwise, a session could be destroyed and we would never clean up its resources, as we'd
            //        miss the notification.
            //  * Create the subscription to monitor sessions and add update our state all within a single
            //    critical region. In addition to this, we must ensure session destruction callbacks are
            //    fired on a different thread.
            //      - Otherwise, we may attempt to remove the session's resources before they are added.
            var sessionId = message.SessionId;
            var replyDestination = message.ReplyTo;
            var subscription = new CompositeDisposable();

            TRequest request;
            if (!TryDeserializeRequest(subscriptionId, message, out request))
                return;

            var clientId = message.Properties.GetString(OperationKeys.ClientId);
            if (clientId == null)
            {
                Log.Warning("No ClientId found. Ignoring.");
                return;
            }

            var sessionDestroyedHandler = new AnonymousUserSessionHandler(_ => { },
                                                                          _ =>
                                                                          {
                                                                              lock (_subscriptions)
                                                                              {
                                                                                  // TODO: Make the Java version clean all resources hooked up here.
                                                                                  // ReSharper disable once AccessToDisposedClosure
                                                                                  subscription.Dispose();
                                                                                  _subscriptions.Remove(subscriptionId);
                                                                              }
                                                                          });

            lock (_subscriptions)
            {
                // TODO: How do we clean up when IsSessionRequired == false?
                if (IsSessionRequired)
                {
                    subscription.Add(UserSessionCache.Subscribe(sessionId, sessionDestroyedHandler));
                }

                var context = CreateRequestContext(message);
                if (context == null)
                {
                    Log.Warning("Failed to create request context. Ignoring.");
                    subscription.Dispose(); // Don't listen for session destruction if it doesn't exist.
                    return;
                }

                // At this point we know the session exists or existed and we know it will be cleared up (after we
                // exit the critical region) by the sessionResourceCleaner if it is destroyed.
                _subscriptions.Add(subscriptionId, subscription);

                try
                {
                    const int notFinished = 0;
                    const int finished = 1;
                    var subscriptionState = notFinished;
                    var notificationSubscription = requestStreamHandler(context,
                                                                        request,
                                                                        new AnonymousStreamHandler<TUpdate>(
                                                                            // TODO: I remove the session from the lookup AND ALSO dipose subscription here.
                                                                            //       This is analagous to the AutoDetachObserver<T> in Rx. Should we do the same in the Java version?
                                                                            //       Review with John. -ZB
                                                                            update => OnUpdated(subscriptionId, replyDestination, update),
                                                                            error =>
                                                                            {
                                                                                if (Interlocked.Exchange(ref subscriptionState, finished) ==
                                                                                    notFinished)
                                                                                {
                                                                                    OnFailed(subscriptionId, replyDestination, error);
                                                                                }
                                                                            },
                                                                            () =>
                                                                            {
                                                                                if (Interlocked.Exchange(ref subscriptionState, finished) ==
                                                                                    notFinished)
                                                                                {
                                                                                    OnCompleted(subscriptionId, replyDestination);
                                                                                }
                                                                            }));
                    subscription.Add(Disposable.Create(() =>
                    {
                        var hasAlreadyFinished = Interlocked.Exchange(ref subscriptionState, finished) == finished;
                        if (!hasAlreadyFinished)
                        {
                            notificationSubscription.Dispose();
                        }
                    }));
                }
                catch (Exception e)
                {
                    const string error = "Failed to process request";
                    OnFailed(subscriptionId, replyDestination, new MessagingException(error, e));
                    Log.Error(error, e);
                }
            }

            SendAck(subscriptionId, replyDestination, clientId);
        }

        private bool TryDeserializeRequest(string subscriptionId, IMessage message, out TRequest request)
        {
            try
            {
                request = _serializer.Deserialize<TRequest>(message.Payload);
                return true;
            }
            catch (SerializationException e)
            {
                const string error = "Failed to deserialize request";
                SendError(subscriptionId, message.ReplyTo, error);
                Log.Error(error, e);
                request = default(TRequest);
                return false;
            }
        }

        private void ProcessUnsubscription(string subscriptionId)
        {
            IDisposable subscription;
            lock (_subscriptions)
            {
                if (_subscriptions.TryGetValue(subscriptionId, out subscription))
                {
                    _subscriptions.Remove(subscriptionId);
                }
            }
            if (subscription != null)
            {
                subscription.Dispose();
            }
        }

        private void OnUpdated(string subscriptionId, ITransientDestination subscriberReplyDestination, TUpdate update)
        {
            if (IsSubscribed(subscriptionId))
            {
                SendUpdate(subscriptionId, subscriberReplyDestination, update);
            }
        }

        private void OnFailed(string subscriptionId, ITransientDestination subscriberReplyDestination, Exception error)
        {
            if (IsSubscribed(subscriptionId))
            {
                ProcessUnsubscription(subscriptionId);
                SendError(subscriptionId, subscriberReplyDestination, error.Message);
            }
        }

        private void OnCompleted(string subscriptionId, ITransientDestination subscriberReplyDestination)
        {
            if (IsSubscribed(subscriptionId))
            {
                ProcessUnsubscription(subscriptionId);
                SendCompletion(subscriptionId, subscriberReplyDestination);
            }
        }

        private void SendAck(string subscriptionId, ITransientDestination subscriberReplyDestination, string clientId)
        {
            var message = _messageFactory.Create(_updateToLiveTime);
            message.Properties.Set(OperationKeys.ClientId, clientId);
            message.Properties.Set(OperationKeys.ServerId, _serverId);
            message.Properties.Set(RequestStreamKeys.SubscriptionId, subscriptionId);
            message.Properties.Set(RequestStreamKeys.UpdateKind, UpdateKind.Ack);
            SendMessage(subscriptionId, subscriberReplyDestination, message);
        }

        private void SendUpdate(string subscriptionId, ITransientDestination subscriberReplyDestination, TUpdate update)
        {
            try
            {
                var payload = _serializer.Serialize(update);
                var message = _messageFactory.Create(payload, _updateToLiveTime);
                message.Properties.Set(RequestStreamKeys.SubscriptionId, subscriptionId);
                message.Properties.Set(RequestStreamKeys.UpdateKind, UpdateKind.Update);
                SendMessage(subscriptionId, subscriberReplyDestination, message);
            }
            catch (SerializationException e)
            {
                OnFailed(subscriptionId,
                         subscriberReplyDestination,
                         new MessagingException("Failed to serialize update", e));
            }
        }

        private void SendError(string subscriptionId, ITransientDestination subscriberReplyDestination, string error)
        {
            var message = _messageFactory.Create(_updateToLiveTime);
            message.Properties.Set(RequestStreamKeys.SubscriptionId, subscriptionId);
            message.Properties.Set(RequestStreamKeys.UpdateKind, UpdateKind.Error);
            message.Properties.Set(RequestStreamKeys.Error, error);
            SendMessage(subscriptionId, subscriberReplyDestination, message);
        }

        private void SendCompletion(string subscriptionId, ITransientDestination subscriberReplyDestination)
        {
            var message = _messageFactory.Create(_updateToLiveTime);
            message.Properties.Set(RequestStreamKeys.SubscriptionId, subscriptionId);
            message.Properties.Set(RequestStreamKeys.UpdateKind, UpdateKind.Completion);
            SendMessage(subscriptionId, subscriberReplyDestination, message);
        }

        private bool IsSubscribed(string subscriptionId)
        {
            lock (_subscriptions)
            {
                return _subscriptions.ContainsKey(subscriptionId);
            }
        }

        private void SendMessage(string subscriptionId,
                                 ITransientDestination subscriberReplyDestination,
                                 IMessage message)
        {
            try
            {
                _publisher.Publish(message, subscriberReplyDestination);
            }
            catch (MessagingException)
            {
                Log.Error("Failed to publish message to subscriber");
                ProcessUnsubscription(subscriptionId);
            }
        }
    }
}
