using System;
using System.IO;
using Adaptive.ReactiveTrader.Server.Launcher;
using FakeItEasy;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.Tests.Launcher
{
    public class LauncherTest : IDisposable
    {
        private readonly IServiceLauncher _testServiceLauncher;
        private readonly Program _program;
        private readonly TextWriter _tmp;
        private readonly StringWriter _strWrite;

        public LauncherTest()
        {
            _tmp = Console.Out;
            _strWrite = new StringWriter();
            Console.SetOut(_strWrite);

            _testServiceLauncher = A.Fake<IServiceLauncher>();
            _program = new Program(_testServiceLauncher);
            _program.CtrlC.Set();
            _program.Running = false;
        }

        [Fact]
        public void pnArgs_PricingServiceLaunchedAndInConsoleOutput()
        {
            var call = A.CallTo(() => _testServiceLauncher.StartService(ServiceType.Pricing));
            call.Returns("p1");

            _program.Run(new[] {"p"});

            call.MustHaveHappened(Repeated.Exactly.Once);

            var output = _strWrite.ToString();
            Assert.Contains("Started Pricing Service: p1", output);
        }

        [Fact]
        public void aInArgs_AnalyticsLaunchedAndInConsoleOutput()
        {
            var call = A.CallTo(() => _testServiceLauncher.StartService(ServiceType.Analytics));
            call.Returns("a1");

            _program.Run(new[] {"a"});
            
            call.MustHaveHappened(Repeated.Exactly.Once);

            var output = _strWrite.ToString();
            Assert.Contains("Started Analytics Service: a1", output);
        }

        [Fact]
        public void aAndInteractiveInArgs_AnalyticsLaunchedAndInteractiveInConsoleOutput()
        {
            var call = A.CallTo(() => _testServiceLauncher.StartService(ServiceType.Analytics));
            call.Returns("a1");

            _program.Run(new[] { "a", "--interactive" });

            var output = _strWrite.ToString();

            call.MustHaveHappened(Repeated.Exactly.Once);
            Assert.Contains("Started Analytics Service: a1", output);
            Assert.Contains("INTERACTIVE MODE", output);
        }

        public void Dispose()
        {
            Console.SetOut(_tmp);
        }
    }
}