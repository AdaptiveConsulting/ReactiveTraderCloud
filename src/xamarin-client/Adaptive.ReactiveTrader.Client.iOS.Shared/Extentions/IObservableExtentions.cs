using System;
using System.Reactive.Subjects;
using System.Reactive.Disposables;
using System.Reactive.Linq;

namespace Adaptive.ReactiveTrader.Client.iOS.Shared
{
    public static class IObservableExtentions
    {
        public static void Add(this IDisposable disposable, CompositeDisposable compositeDisposable)
        {
            compositeDisposable.Add(disposable);
        }

        public static IDisposable Bind<T>(this ISubject<T> subject1, ISubject<T> subject2)
        {
            return new CompositeDisposable
            {
                subject1.Subscribe(subject2),
                subject2.Subscribe(subject1)
            };
        }

        public static IObservable<TInput> WhereLatest<TInput>(this IObservable<TInput> inputStream, IObservable<bool> conditionStream)
        {
            return inputStream
                    .CombineLatest(
                        conditionStream,
                        (input, condition) => new { Input = input, Condition = condition }
                    )
                    .Where(x => x.Condition)
                    .Select(x => x.Input);
               
        }
    }
    
}