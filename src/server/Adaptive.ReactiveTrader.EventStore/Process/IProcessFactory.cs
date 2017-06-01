namespace Adaptive.ReactiveTrader.EventStore.Process
{
    public interface IProcessFactory
    {
        T Create<T>() where T : IProcess, new();
    }
}