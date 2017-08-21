using System;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using CoreFoundation;

namespace Adaptive.ReactiveTrader.Client.iOSTab
{

	public class iOSDispatcherScheduler : IScheduler
	{
		public IDisposable Schedule<TState>(TState state, Func<IScheduler, TState, IDisposable> action)
		{
			return Work(state, action);
		}

		public IDisposable Schedule<TState>(TState state, TimeSpan dueTime, Func<IScheduler, TState, IDisposable> action)
		{
			return Work(state, dueTime, action);
		}

		public IDisposable Schedule<TState>(TState state, DateTimeOffset dueTime, Func<IScheduler, TState, IDisposable> action)
		{
			return Work(state, dueTime.Subtract(Now), action);
		}

		public DateTimeOffset Now => DateTimeOffset.Now;

	    private IDisposable Work<TState>(TState state, Func<IScheduler, TState, IDisposable> action)
		{
			var cd = new CompositeDisposable();
			var bd = new BooleanDisposable();

			cd.Add(bd);

			DispatchQueue.MainQueue.DispatchAsync(() =>
				{
					if (!bd.IsDisposed)
						cd.Add(action(this, state));
				});

			return cd;
		}

		private IDisposable Work<TState>(TState state, TimeSpan dueTime, Func<IScheduler, TState, IDisposable> action)
		{
			var cd = new CompositeDisposable();
			var bd = new BooleanDisposable();

			cd.Add(bd);

			DispatchQueue.MainQueue.DispatchAfter(new DispatchTime((ulong)dueTime.TotalMilliseconds * 100000), () =>
				{
					if (!bd.IsDisposed)
						cd.Add(action(this, state));
				});

			return cd;
		}
	}}

