using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Threading;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Common.Config;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Connection;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Common.Logging.Simple;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.Core
{
    public static class OptionExtensions
    {
        public static IConnected<TResult> Select<TSource, TResult>(this IConnected<TSource> source,
            Func<TSource, TResult> selector)
        {
            if (source.IsConnected)
                return new Connected<TResult>(selector(source.Value));

            return new Connected<TResult>();
        }

        public static IObservable<IConnected<TResult>> LaunchOrKill<TSource, TResult>(
            this IObservable<IConnected<TSource>> source,
            Func<TSource, TResult> selector) where TResult : IDisposable
        {
            return source.Select(s => GetInstanceStream(() => s.Select(selector)))
                .Switch();
        }

        private static IObservable<IConnected<T>> GetInstanceStream<T>(Func<IConnected<T>> factory)
            where T : IDisposable
        {
            return Observable.Create<IConnected<T>>(obs =>
            {
                var instance = factory();
                obs.OnNext(instance);
                return instance.IsConnected ? Disposable.Create(() => instance.Value.Dispose()) : Disposable.Empty;
            });
        }

        public static IObservable<IConnected<TResult>> LaunchOrKill<TSource, TSource2, TResult>(
            this IObservable<IConnected<TSource>> first, IObservable<IConnected<TSource2>> second,
            Func<TSource, TSource2, TResult> selector) where TResult : IDisposable
        {
            return first.CombineLatest(second,
                (a, b) =>
                    GetInstanceStream(() =>
                        a.IsConnected && b.IsConnected
                            ? new Connected<TResult>(selector(a.Value, b.Value))
                            : new Connected<TResult>()))
                .Switch();
        }
    }


    public interface IServceHostFactor
    {
        IDisposable Initialize(IObservable<IConnected<IBroker>> broker);
    }

    public interface IServceHostFactoryWithEventStore : IServceHostFactor
    {
        IDisposable Initialize(IObservable<IConnected<IBroker>> broker,
            IObservable<IConnected<IEventStoreConnection>> eventStore);
    }

    public class App
    {
        private static readonly ILog Log = LogManager.GetLogger<App>();

        public static void Run(string[] args, IServceHostFactor factory)
        {
            LogManager.Adapter = new ConsoleOutLoggerFactoryAdapter
            {
                ShowLogName = true
            };

            var config = ServiceConfiguration.FromArgs(args);


            // broker connection

            try
            {
                var connectionFactory = BrokerConnectionFactory.Create(config.Broker);

                var brokerStream = connectionFactory.GetBrokerStream();

                factory.Initialize(brokerStream);


                var esFactory = factory as IServceHostFactoryWithEventStore;


                if (esFactory != null)
                {
                    // TODO TIDY

                    var eventStoreConnection = EventStoreConnectionFactory.Create(EventStoreLocation.External,
                        config.EventStore);
                    var mon = new ConnectionStatusMonitor(eventStoreConnection);
                    var esStream = mon.GetEventStoreConnectedStream(eventStoreConnection);
                    eventStoreConnection.ConnectAsync().Wait();

                    esFactory.Initialize(brokerStream, esStream);
                }

                connectionFactory.Start();
                
                while (true)
                    Thread.Sleep(ThreadSleep);
            }
            catch (Exception e)
            {
                Log.Error(e);
            }
        }

        public const int ThreadSleep = 5000;
    }
}