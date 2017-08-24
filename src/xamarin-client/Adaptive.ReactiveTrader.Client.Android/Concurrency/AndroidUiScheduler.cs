using System;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using Android.OS;

namespace Adaptive.ReactiveTrader.Client.Android.Concurrency
{
    public class AndroidUiScheduler : IScheduler
    {
        public static AndroidUiScheduler Instance { get; private set; }

        private readonly Handler _handler;

        public AndroidUiScheduler(Looper mainLooper)
        {
            _handler = new Handler(mainLooper);
            Instance = this;
        }

        public IDisposable Schedule<TState>(TState state, Func<IScheduler, TState, IDisposable> action)
        {
            var disposable = new BooleanDisposable();
            _handler.Post(() =>
            {
                if (!disposable.IsDisposed)
                {
                    action(this, state);
                }
            });

            return disposable;
        }

        public IDisposable Schedule<TState>(TState state, TimeSpan dueTime, Func<IScheduler, TState, IDisposable> action)
        {
            var disposable = new BooleanDisposable();
            _handler.PostDelayed(() =>
            {
                if (!disposable.IsDisposed)
                {
                    action(this, state);
                }
            }, (long)dueTime.TotalMilliseconds);

            return disposable;
        }

        public IDisposable Schedule<TState>(TState state, DateTimeOffset dueTime, Func<IScheduler, TState, IDisposable> action)
        {
            var disposable = new BooleanDisposable();

            var due = dueTime - DateTimeOffset.Now;
            if (due.TotalMilliseconds < 0)
            {
                due = TimeSpan.Zero;
            }

            _handler.PostDelayed(() =>
            {
                if (!disposable.IsDisposed)
                {
                    action(this, state);
                }
            }, (long)due.TotalMilliseconds);

            return disposable;
        }

        public DateTimeOffset Now => DateTimeOffset.Now;
    }
}