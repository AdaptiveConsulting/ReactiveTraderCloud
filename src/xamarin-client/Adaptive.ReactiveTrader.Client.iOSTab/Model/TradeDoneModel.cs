using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;

namespace Adaptive.ReactiveTrader.Client.iOSTab.Model
{
	public class TradeDoneModel
	{
		public ITrade Trade { get; private set; }

		public TradeDoneModel (ITrade trade)
		{
			Trade = trade;
		}
	}

}

