using System;
using System.Reactive.Concurrency;

namespace Adaptive.ReactiveTrader.Messaging
{
    public class OperationFactory
    {
        public IRequestStreamServer<TRequest, TUpdate> CreateRequestStream<TRequest, TUpdate>(string rpcName,
            IBroker broker)
        {
            var messageFactory = new MessageFactory();

            ISubscriber subscriber = new Subscriber();
            IPublisher publisher = new Publisher();
            IUserSessionCache userSessionCache = new UserSessionCache();
            ISerializer serializer = new Serializer();
            IScheduler scheduler = Scheduler.Default;

            return new RequestStreamServer<TRequest, TUpdate>(subscriber, publisher, userSessionCache, serializer,
                scheduler, messageFactory, TimeSpan.Zero, false);
        }
    }
}