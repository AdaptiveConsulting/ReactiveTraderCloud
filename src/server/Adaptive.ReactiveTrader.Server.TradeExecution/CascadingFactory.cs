using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    /*

    public class EsConnection : IDisposable
    {
        public void Dispose()
        {
        }
    }

    public class Broker : IDisposable
    {
        public void Dispose()
        {
        }
    }

    public class Cache : IDisposable
    {
        private static int _cacheCount = 0;

        public Cache(EsConnection dependency)
        {
            Console.WriteLine("Cache {0} Created", ++_cacheCount);
        }

        public void Dispose()
        {
            Console.WriteLine("Cache {0} Disposed", _cacheCount);
        }
    }

    public class Service : IDisposable
    {
        private static int _cacheCount = 0;

        public Service(Cache cache)
        {
            Console.WriteLine("Service {0} Created", ++_cacheCount);
        }

        public void Dispose()
        {
            Console.WriteLine("Service {0} Disposed", _cacheCount);
        }
    }

    public class ServiceHost : IDisposable
    {
        private static int _cacheCount = 0;

        public ServiceHost(Broker b, Service service)
        {
            Console.WriteLine("ServiceHost {0} Created", ++_cacheCount);
        }

        public void Dispose()
        {
            Console.WriteLine("ServiceHost {0} Disposed", _cacheCount);
        }
    }
    
    public class CascadingFactory
    {
        private static Subject<char> _keyPresses = new Subject<char>();

        public static void Main(string[] args)
        {
            _keyPresses.Subscribe(_ => Console.WriteLine());

            var connectionStream =
                _keyPresses.Where(k => k == 'o' || k == 'p')
                    .Select(k => k == 'o' ? new Connected<EsConnection>(new EsConnection()) : new Connected<EsConnection>())
                    .Do(o => Console.WriteLine("ES is {0}", o.IsConnected ? "on" : "off"));

            var brokerConnectionStream =
                _keyPresses.Where(k => k == 'k' || k == 'l')
                    .Select(k => k == 'k' ? new Connected<Broker>(new Broker()) : new Connected<Broker>())
                    .Do(o => Console.WriteLine("Broker is {0}", o.IsConnected ? "on" : "off"));

            var cacheStream = connectionStream.LaunchOrKill(conn => new Cache(conn));
            var serviceStream = cacheStream.LaunchOrKill(c=> new Service(c));

            var serviceHostStream = brokerConnectionStream.LaunchOrKill(serviceStream, (b, s) => new ServiceHost(b, s));

            serviceHostStream.Subscribe(o => { });

            while (true)
                _keyPresses.OnNext(Console.ReadKey().KeyChar);
            
            // EventStore
                // Cache
                    // Service
            // Broker
        }



        
    }
    */
}