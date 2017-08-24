using System;

namespace Adaptive.ReactiveTrader.Client.iOSTab
{
	public interface INotionalDelegateRecipient
	{
		void NotionalValueEditStarted ();

		void NotionalValueEditComplete ();
	}
}

