using System;
using UIKit;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Reactive.Disposables;
using System.Diagnostics;

namespace Adaptive.ReactiveTrader.Client.iOS.Shared
{
    public static class UISwitchExtentions
    {
        public static IObservable<bool> ValueChangedStream(this UISwitch uiSwitch)
        {
            return Observable.FromEventPattern(
                h => uiSwitch.ValueChanged += h,
                h => uiSwitch.ValueChanged -= h
            )
            .Select(_ => uiSwitch.On)
            .DistinctUntilChanged();
        }

        public static IDisposable Bind(this UISwitch uiSwitch, ISubject<bool> subject)
        {
            return uiSwitch
                .ValueChangedStream()
                .Bind(
                    subject,
                    x => 
                    {
                        Debug.WriteLine($"Setting switch to {x}");
                        uiSwitch.On = x;
                    }
                );
        }

        public static IDisposable Bind<T>(this IObservable<T> eventStream, ISubject<T> subject, Action<T> setAction)
        {
            return new CompositeDisposable
            {
                subject.Subscribe(setAction),
                eventStream.Subscribe(subject)
            };
        }
    }
}