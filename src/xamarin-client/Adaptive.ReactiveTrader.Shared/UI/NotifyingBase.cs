using System.ComponentModel;
using Adaptive.ReactiveTrader.Shared.Properties;

namespace Adaptive.ReactiveTrader.Shared.UI
{
    public class NotifyingBase : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        [NotifyPropertyChangedInvocator]
        protected virtual void OnPropertyChanged(string propertyName)
        {
            var handler = PropertyChanged;
            if (handler != null)
            {
                handler(this, new PropertyChangedEventArgs(propertyName));
            }
        }
    }
}
