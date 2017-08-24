using System;
using System.Diagnostics;

namespace Adaptive.ReactiveTrader.Shared.Logging
{
    internal class DebugLogger : ILog
    {
        private readonly string _loggerName;

        public DebugLogger(string loggerName)
        {
            _loggerName = loggerName;
        }

        public void Info(string msg, Exception ex = null)
        {
            WriteMessage("INFO", "{0} {1}", msg, ex);
        }

        public void InfoFormat(string msg, params object[] parameters)
        {
            WriteMessage("INFO", msg, parameters);
        }

        public void Warn(string msg, Exception ex = null)
        {
            WriteMessage("WARN", "{0} {1}", msg, ex);
        }

        public void WarnFormat(string msg, params object[] parameters)
        {
            WriteMessage("WARN", msg, parameters);
        }

        public void Error(string msg, Exception ex = null)
        {
            WriteMessage("ERROR", "{0} {1}", msg, ex);
        }

        public void ErrorFormat(string msg, params object[] parameters)
        {
            WriteMessage("ERROR", msg, parameters);
        }

        private void WriteMessage(string level, string message, params object[] parameters)
        {
            Debug.WriteLine("{0:dd MMM yyyy HH:mm:ss,fff} {1} {2} - {3}",  DateTime.Now, level, _loggerName, parameters.Length == 0 ? message : string.Format(message, parameters));
        }
    }
}