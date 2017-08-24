using System;
using Foundation;
using System.Reactive.Subjects;
using System.Reactive.Linq;
using System.Reactive.Disposables;
using System.Diagnostics;

namespace Adaptive.ReactiveTrader.Client.iOS.Shared
{
    public abstract class ObservableUserDefault<T> : ISubject<T>
    {
        protected NSUserDefaults Defaults { get; } = new NSUserDefaults("default");
        protected string DefaultName { get; }

        BehaviorSubject<T> _subject;
        BehaviorSubject<T> Subject
        {
            get
            {
                if (_subject == null)
                {
                    _subject = new BehaviorSubject<T>(GetValue());
                }

                return _subject;
            }
        }
 
        protected ObservableUserDefault(string defaultName)
        {
            DefaultName = defaultName;
        }

        protected abstract T GetValue();
        protected abstract void SetValue(T value);

        // IObservable 

        public IDisposable Subscribe(IObserver<T> observer)
        {
            return Subject.Do(x => Debug.WriteLine($"Sending from subject: {x}")).Subscribe(observer);
        }

        // IObserver - incoming settings from UI

        public void OnNext(T value)
        {
            SetValue(value);
            Subject.OnNext(value);
        }

        public void OnError(Exception error)
        {
            Subject.OnError(error);
        }

        public void OnCompleted()
        {
            Subject.OnCompleted();
        }
    }        
}