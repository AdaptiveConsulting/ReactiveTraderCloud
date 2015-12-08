using Xunit;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class ExecuteTradeTests
    {
        private TestBroker _broker;

        public ExecuteTradeTests()
        {
            _broker = new TestBroker();
        }

        [Fact]
        public async void ShouldReceiveExecutedTradeInBlotter()
        {
            
        }
    }
}