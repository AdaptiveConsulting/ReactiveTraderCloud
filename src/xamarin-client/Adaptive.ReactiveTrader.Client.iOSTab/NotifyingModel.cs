using System;
using System.Linq;
using System.Reactive.Linq;
using Foundation;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Client.Concurrency;
using Adaptive.ReactiveTrader.Shared.DTO.Pricing;
using System.ComponentModel;
using System.Threading.Tasks;
using System.Reactive.Subjects;
using System.Reactive;

namespace Adaptive.ReactiveTrader.Client.iOSTab
{
	public abstract class NotifyingModel<T> : INotifyChanged<T>
	{
		#region INotifyChanged implementation
		private readonly Subject<T> _onChanged = new Subject<T>();

		public IObservable<T> OnChanged => _onChanged.AsObservable ();

	    protected void NotifyOnChanged(T instance) {
			_onChanged.OnNext (instance);
		}
		#endregion
	}


}

