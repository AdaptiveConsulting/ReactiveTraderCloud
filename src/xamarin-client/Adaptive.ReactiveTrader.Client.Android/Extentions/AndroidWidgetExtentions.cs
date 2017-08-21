using System;
using System.Reactive.Linq;
using Android.Text;
using Android.Widget;

namespace Adaptive.ReactiveTrader.Client.Android.Extentions
{
    static class AndroidWidgetExtentions
    {
        public static IObservable<string> TextChangedStream(this EditText editText)
        {
            return Observable.FromEventPattern<TextChangedEventArgs>(
                h => editText.TextChanged += h,
                h => editText.TextChanged -= h).Select(_ => editText.Text);
        }
    }
}