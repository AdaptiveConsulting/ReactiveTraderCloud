using System;
using System.Reactive.Disposables;

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public class ConsoleLogger
    {
        public void Info(string format, params object[] arg)
        {
            using (Colour(ConsoleColor.Green))
                Console.WriteLine(format, arg);
        }

        public void Info()
        {
            Console.WriteLine();
        }

        public void Error()
        {
            Console.WriteLine();
        }

        public void Error(string format, params object[] arg)
        {
            using (Colour(ConsoleColor.Red))
                Console.WriteLine(format, arg);
        }

        private IDisposable Colour(ConsoleColor colour)
        {
            var previousColour = Console.ForegroundColor;
            Console.ForegroundColor = colour;
            return Disposable.Create(() => Console.ForegroundColor = previousColour);
        }
    }
}