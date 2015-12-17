using System;
using Microsoft.Reactive.Testing;

namespace RxStreamingConnectionAbstraction
{
    internal class Program
    {
        private readonly TestScheduler _scheduler = new TestScheduler();
        private readonly int _startAtSecond;
        private readonly Connection _connection;
        private ServiceClient _pricingServiceClient;
        private ServiceClient _executionServiceClient;
        private const string TRADE_EXECUTION_TOPIC = "TRADE_EXECUTION_TOPIC";
        private const string PRICE_TOPIC = "TRADE_TOPIC";

        private static void Main(string[] args)
        {
            new Program().Run();
        }

        public Program()
        {
            _startAtSecond = (int)_scheduler.Now.TimeOfDay.TotalSeconds;
            _connection = new Connection();
        }

        public void Run()
        {
            Console.WriteLine("{0} - Starting", 0);

            _pricingServiceClient = new ServiceClient(_connection, "pricing", _scheduler);
            _executionServiceClient = new ServiceClient(_connection, "execution", _scheduler);

            SuccessfulPricingResponsesScenario();
//            Console.WriteLine("{0} -----------------------------", GetElapsedSecondsSinceStart());
//            SuccessfulExecutionScenario();

            Console.ReadKey();
        }
        
        private void SuccessfulPricingResponsesScenario()
        {
            _connection.ConnectionStatus.OnNext(true);

            ListenToPricingServiceStatus();
            _pricingServiceClient.Connect();
            PushConnectionStatus(new ServiceStatusDto("pricing", "1", 10));
            SubscribeToPriceStream();
            Console.WriteLine("Pushing price");
            _connection.PushResposne(PRICE_TOPIC, 1.2345m);
            _connection.PushResposne(PRICE_TOPIC, 1.2346m);

            // disconnect the only instance available 
            Console.WriteLine("Disconnecting instance");
            AdvanceTimeBy(ServiceClient.DISCONNECT_TIMEOUT_IN_SECONDS);
            // push a new instance 
            PushConnectionStatus(new ServiceStatusDto("pricing", "2", 10));
            _connection.PushResposne(PRICE_TOPIC, 1.2347m);

            // disconnect all instance available 
            AdvanceTimeBy(ServiceClient.DISCONNECT_TIMEOUT_IN_SECONDS);
            // reconnect instance 2
            PushConnectionStatus(new ServiceStatusDto("pricing", "2", 10));
            _connection.PushResposne(PRICE_TOPIC, 1.2348m);

            // disconnect the underlying connection 
            Console.WriteLine("Disconnecting underlying");
            _connection.ConnectionStatus.OnNext(false);
            _connection.ConnectionStatus.OnNext(true);
            PushConnectionStatus(new ServiceStatusDto("pricing", "2", 10));
            _connection.PushResposne(PRICE_TOPIC, 1.2347m);
        }

        private void SuccessfulExecutionScenario()
        {
            ListenToExecutionServiceStatus();
            _executionServiceClient.Connect();
            PushConnectionStatus(new ServiceStatusDto("execution", "1", 10));
            ExecuteTrade();
            _connection.PushResposne(TRADE_EXECUTION_TOPIC, "Trade Booked");
        }

        private void ListenToPricingServiceStatus()
        {
            _pricingServiceClient.ServiceStatusStream.Subscribe(statusSummary =>
            {
                Console.WriteLine("{0} - Pricing Service Status Summary {1}", GetElapsedSecondsSinceStart(), statusSummary);
            });
        }

        private void SubscribeToPriceStream()
        {
            _pricingServiceClient
                .CreateStreamOperation<decimal>(PRICE_TOPIC)
                .RetryWithPolicy(RetryPolicy.Forever(), "GetPGetPriceStream")
                .Subscribe(
                    response =>
                    {
                        Console.WriteLine("{0} - GetPGetPriceStream Response received {1}", GetElapsedSecondsSinceStart(), response);
                    },
                    ex => Console.WriteLine("{0} - GetPGetPriceStream error: {1}", GetElapsedSecondsSinceStart(), ex),
                    () => Console.WriteLine("{0} - GetPGetPriceStream completed", GetElapsedSecondsSinceStart())
                );
        }

        private void ListenToExecutionServiceStatus()
        {
            _executionServiceClient.ServiceStatusStream.Subscribe(statusSummary =>
            {
                Console.WriteLine("{0} - Execution Service Status Summary {1}", GetElapsedSecondsSinceStart(), statusSummary);
            });
        }

        private void ExecuteTrade()
        {
            _executionServiceClient.CreateRequestResponseOperation<string, string>(TRADE_EXECUTION_TOPIC, "ExecuteTradeRequestPayload").Subscribe(
                response =>
                {
                    Console.WriteLine("{0} - ExecuteTrade Response received {1}", GetElapsedSecondsSinceStart(), response);
                },
                ex => Console.WriteLine("{0} - ExecuteTrade error: {1}", GetElapsedSecondsSinceStart(), ex),
                () => Console.WriteLine("{0} - ExecuteTrade completed", GetElapsedSecondsSinceStart())
            );
        }

        private int GetElapsedSecondsSinceStart()
        {
            return (int)_scheduler.Now.TimeOfDay.TotalSeconds - _startAtSecond;
        }

        private void AdvanceTimeBy(int seconds)
        {
            _scheduler.AdvanceBy(TimeSpan.FromSeconds(seconds).Ticks);
        }

        private void PushConnectionStatus(ServiceStatusDto status)
        {
            Console.WriteLine("{0} - Pushing service status{1}", GetElapsedSecondsSinceStart(), status);
            _connection.PushResposne("status", status);
        }
    }
}