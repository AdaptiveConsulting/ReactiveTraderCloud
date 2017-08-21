using System;
using Adaptive.ReactiveTrader.Shared.Logging;

namespace Adaptive.ReactiveTrader.Client.iOSTab.Logging
{
	internal class Log : ILog
	{
		private readonly string _name;
		private readonly ILogSink _logSink;

		public Log (string name, ILogSink logSink)
		{
			_name = name;
			_logSink = logSink;
		}

		#region ILog implementation

		public void Info (string msg, Exception ex = null)
		{
			_logSink.Log (GetString ("INFO", msg, ex));
		}

		public void InfoFormat (string msg, params object[] parameters)
		{
			_logSink.Log (GetString ("INFO", msg, null, parameters));
		}

		public void Warn (string msg, Exception ex = null)
		{
			_logSink.Log (GetString ("WARN", msg, ex));
		}

		public void WarnFormat (string msg, params object[] parameters)
		{
			_logSink.Log (GetString ("WARN", msg, null, parameters));
		}

		public void Error (string msg, Exception ex = null)
		{
			_logSink.Log (GetString ("ERROR", msg, ex));
		}

		public void ErrorFormat (string msg, params object[] parameters)
		{
			_logSink.Log (GetString ("ERROR", msg, null, parameters));
		}

		private string GetString(string level, string msg, Exception ex, params object[] parameters) {
			if (ex == null)
				return string.Format ("{0} - {1} {2}: {3}", _name, level, DateTime.Now.TimeOfDay, string.Format (msg, parameters));
			return string.Format ("{0} - {1} {2}: {3} [{4}]", _name, level, DateTime.Now.TimeOfDay, string.Format (msg, parameters), ex);
		}

		#endregion
	}
}

