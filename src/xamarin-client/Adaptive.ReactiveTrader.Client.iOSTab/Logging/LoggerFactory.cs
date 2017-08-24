using System;
using Adaptive.ReactiveTrader.Shared.Logging;

namespace Adaptive.ReactiveTrader.Client.iOSTab.Logging
{
	public class LoggerFactory : ILoggerFactory
	{
		private readonly ILogSink _logSink;

		public LoggerFactory (ILogSink logSink)
		{
			_logSink = logSink;
		}

		#region ILoggerFactory implementation

		public ILog Create (Type type)
		{
			return new Log (type.Name, _logSink);
		}

		#endregion
	}
}

