using System;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class PriceTickListener
    {
        private static readonly ILog Log = LogManager.GetLogger<PriceTickListener>();
        private readonly IScheduler _eventLoopScheduler = new EventLoopScheduler();
        private readonly IObservable<IConnected<IBroker>> _brokerStream;
        private IConnectableObservable<IConnected<IBroker>> _connectionChanged;

        private CompositeDisposable Disposables { get; }

        public PriceTickListener(IObservable<IConnected<IBroker>> brokerStream)
        {
            _connectionChanged = brokerStream
                .ObserveOn(_eventLoopScheduler)
                .Publish();

            Disposables = new CompositeDisposable
            {
                _connectionChanged.Connect(),

                _connectionChanged.Subscribe(x =>
                {
                    if (x.IsConnected)
                    {
                        if (Log.IsInfoEnabled)
                        {
                            Log.Info("Connected to broker");
                        }

                        Initialize(x.Value);
                    }
                    else
                    {
                        if (Log.IsInfoEnabled)
                        {
                            Log.Info("Disconnected from broker");
                        }

                    }
                })
            };
        }

        private void Initialize(IBroker broker)
        {
            broker.
        }
    }
}