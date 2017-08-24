using System;
using Adaptive.ReactiveTrader.Client.iOSTab.Model;

namespace Adaptive.ReactiveTrader.Client.iOSTab.Tiles
{
	public interface IPriceTileCell
	{
		void UpdateFrom (PriceTileModel model);
	}

}

