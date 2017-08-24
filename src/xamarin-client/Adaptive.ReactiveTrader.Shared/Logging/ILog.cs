using System;

namespace Adaptive.ReactiveTrader.Shared.Logging
{
    public interface ILog
    {
        void Info(string msg, Exception ex = null);
        void InfoFormat(string msg, params object[] parameters);
        void Warn(string msg, Exception ex = null);
        void WarnFormat(string msg, params object[] parameters);
        void Error(string msg, Exception ex = null);
        void ErrorFormat(string msg, params object[] parameters);
    }
}