using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters
{
  public interface IMarketDataAdapter
  {
    Task<IEnumerable<MarketData>> GetMarketData();
    string RequestUriString { get; }
  }
}
