using System;
using System.Reactive.Subjects;

namespace Adaptive.ReactiveTrader.Client.iOSTab.Logging
{
	internal class LogHub : ILogSink, ILogSource
	{
		private readonly ISubject<string> _source = new Subject<string>();

		public void Log (string message)
		{
			_source.OnNext (message);
		}

		public IObservable<string> LogSource => (IObservable<string>)_source;
	}
}