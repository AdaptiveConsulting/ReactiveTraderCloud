using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Server.ReferenceDataWrite;
using FakeItEasy;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.Tests.ReferenceDataWrite
{
    public class CurrencyPairInitializerTests
    {
        private readonly ICurrencyPairRepository _ccyRepo;
        private readonly CurrencyPairInitializer _sut;

        public CurrencyPairInitializerTests()
        {
            _ccyRepo = A.Fake<ICurrencyPairRepository>();
            A.CallTo(() => _ccyRepo.Create(A<string>._, A<int>._, A<int>._, A<decimal>._, A<string>._))
                .Returns(Task.FromResult(0));

            _sut = new CurrencyPairInitializer(_ccyRepo);
        }

        [Fact]
        public async void CurrencyPairInitializerShouldCreateCcyPairs()
        {
            await _sut.WriteInitialEventsAsync();

            A.CallTo(() => _ccyRepo.Create(A<string>._, A<int>._, A<int>._, A<decimal>._, A<string>._)).MustHaveHappened(Repeated.Exactly.Times(21));
        }

        [Fact]
        public async void CurrencyPairInitializerShouldActivateCcyPairs()
        {
            await _sut.WriteInitialEventsAsync();

            A.CallTo(() => _ccyRepo.Activate(A<string>._)).MustHaveHappened(Repeated.Exactly.Times(4));
        }

        [Fact]
        public async void CurrencyPairInitializerShouldActivateCcyPairsAfterCreatingThem()
        {
            using (var scope = Fake.CreateScope())
            {
                await _sut.WriteInitialEventsAsync();

                using (scope.OrderedAssertions())
                {
                    A.CallTo(() => _ccyRepo.Create("EURUSD", A<int>._, A<int>._, A<decimal>._, A<string>._)).MustHaveHappened(Repeated.Exactly.Once);
                    A.CallTo(() => _ccyRepo.Create("USDJPY", A<int>._, A<int>._, A<decimal>._, A<string>._)).MustHaveHappened(Repeated.Exactly.Once);
                    A.CallTo(() => _ccyRepo.Create("GBPUSD", A<int>._, A<int>._, A<decimal>._, A<string>._)).MustHaveHappened(Repeated.Exactly.Once);
                    A.CallTo(() => _ccyRepo.Create("GBPJPY", A<int>._, A<int>._, A<decimal>._, A<string>._)).MustHaveHappened(Repeated.Exactly.Once);
                    A.CallTo(() => _ccyRepo.Activate("EURUSD")).MustHaveHappened(Repeated.Exactly.Once);
                    A.CallTo(() => _ccyRepo.Activate("USDJPY")).MustHaveHappened(Repeated.Exactly.Once);
                    A.CallTo(() => _ccyRepo.Activate("GBPUSD")).MustHaveHappened(Repeated.Exactly.Once);
                    A.CallTo(() => _ccyRepo.Activate("GBPJPY")).MustHaveHappened(Repeated.Exactly.Once);
                }
            }
        }
    }
}
