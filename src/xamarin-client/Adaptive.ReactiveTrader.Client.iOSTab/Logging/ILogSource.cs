using System;

namespace Adaptive.ReactiveTrader.Client.iOSTab.Logging {

	public interface ILogSource
	{
		IObservable<string> LogSource { get;}
	}

}
