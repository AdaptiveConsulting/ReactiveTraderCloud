import { Direction } from './';

export default class ExecuteTradeRequest {
  currencyPair:String;
  spotRate:Number;
  direction:Direction;
  notional:Number;
  dealtCurrency:String;

  constructor(currencyPair:String, spotRate:Number, direction:Direction, notional:Number, dealtCurrency:String) {
    this.currencyPair = currencyPair;
    this.spotRate = spotRate;
    this.direction = direction;
    this.notional = notional;
    this.dealtCurrency = dealtCurrency;
  }
}
