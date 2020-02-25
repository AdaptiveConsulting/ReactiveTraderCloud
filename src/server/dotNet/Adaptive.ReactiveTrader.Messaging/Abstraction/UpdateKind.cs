namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    internal static class UpdateKind
    {
        public const string Update = "UPDATE";
        public const string Completion = "COMPLETED";
        public const string Error = "ERROR";
        public const string Ack = "ACKNOWLEDGEMENT";
    }
}
