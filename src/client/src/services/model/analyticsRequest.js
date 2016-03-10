export default class AnalyticsRequest {
  constructor(currencyPairSymbol:string) {
    // note odd casing here as server expects upper camel casing
    this.Symbol = currencyPairSymbol;
  }
}
