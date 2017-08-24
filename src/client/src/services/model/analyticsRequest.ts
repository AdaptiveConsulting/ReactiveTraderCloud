export default class AnalyticsRequest {
  Symbol: string;

  constructor(currencyPairSymbol: string) {
    // note odd casing here as server expects upper camel casing
    this.Symbol = currencyPairSymbol;
  }
}
