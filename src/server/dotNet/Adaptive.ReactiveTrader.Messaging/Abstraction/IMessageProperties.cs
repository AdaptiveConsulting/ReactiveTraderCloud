using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public interface IMessageProperties
    {
        IEnumerable<string> Keys { get; }
        void Set(string key, string value);
        void Set(string key, int value);
        void Set(string key, long value);
        void Set(string key, double value);
        void Set(string key, bool value);
        string GetString(string key);
        int GetInt(string key);
        long GetLong(string key);
        double GetDouble(string key);
        bool GetBool(string key);
    }
}