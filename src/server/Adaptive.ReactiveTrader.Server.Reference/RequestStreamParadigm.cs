using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Transport;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public class RequestStreamParadigm<T> : IRequestStream
    {
        private readonly IBroker _b;
        private readonly Func<IEnumerable<T>> _stateOfTheWorld;
        private readonly IObservable<T> _updates;

        public RequestStreamParadigm(IBroker b, Func<IEnumerable<T>> stateOfTheWorld, IObservable<T> updates)
        {
            _b = b;
            _stateOfTheWorld = stateOfTheWorld;
            _updates = updates;
        }

        public async Task Subscribe(string queueName)
        {
            var publisher = await _b.CreateChannelAsync<T>(queueName);
            _updates.Subscribe(publisher); // TODO should cache any values from here and send after state of the world

            foreach (var i in _stateOfTheWorld())
                publisher.OnNext(i);
        }
    }
}