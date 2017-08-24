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

	public interface INotifyChanged<T> {
		IObservable<T> OnChanged { get; }
	}

}
