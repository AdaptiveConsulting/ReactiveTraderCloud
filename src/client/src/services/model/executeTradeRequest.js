import { Direction } from './';

export default class ExecuteTradeRequest {
  // note odd casing here as server expects upper camel casing
  CurrencyPair:String;
  SpotRate:Number;
  Direction:Direction;
  Notional:Number;
  DealtCurrency:String;

  constructor(
    currencyPair:String,
    spotRate:Number,
    direction:Direction,
    notional:Number,
    dealtCurrency:String
  ) {
    this.CurrencyPair = currencyPair;
    this.SpotRate = spotRate;
    this.Direction = direction;
    this.Notional = notional;
    this.DealtCurrency = dealtCurrency;
  }

  toString() {
    return `${this.Direction} ${this.CurrencyPair} (${this.DealtCurrency}) ${this.Notional} @ ${this.SpotRate}`;
  }
}
