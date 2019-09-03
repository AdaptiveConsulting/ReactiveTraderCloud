using Newtonsoft.Json.Linq;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters
{
  /// <summary>
  /// Scrapes currency pair data websites compatible with fixer.io and returns the currency pairs
  /// </summary>
  public abstract class FixerBaseAdapter : AdapterBase
  {
    protected readonly string[] _currencies = new[] { "EUR", "USD", "JPY", "GBP", "NZD", "AUD", "CAD", "CHF" };

    public FixerBaseAdapter(string requestUriString) : base(requestUriString)
    {
    }
  }
}
