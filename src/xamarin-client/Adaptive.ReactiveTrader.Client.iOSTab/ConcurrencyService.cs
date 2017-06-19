using Adaptive.ReactiveTrader.Client.Concurrency;
using System.Reactive.Concurrency;
using System;

namespace Adaptive.ReactiveTrader.Client.iOSTab
{

	public class ConcurrencyService : IConcurrencyService
	{
		private readonly IScheduler _dispatcher;

		public ConcurrencyService()
		{
			_dispatcher = new iOSDispatcherScheduler();
		}

		public IScheduler Dispatcher
		{
			get { return _dispatcher; }
		}

		public IScheduler DispatcherPeriodic { get { throw new NotImplementedException ("");} }
		public IScheduler TaskPool { get { return TaskPoolScheduler.Default; } }
	}}

