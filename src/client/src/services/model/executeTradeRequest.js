import { Direction } from './';

export default class ExecuteTradeRequest {
  _currencyPair:String;
  _spotRate:Number;
  _direction:Direction;
  _notional:Number;
  _dealtCurrency:String;

  constructor(currencyPair:String, spotRate:Number, direction:Direction, notional:Number, dealtCurrency:String) {
    this._currencyPair = currencyPair;
    this._spotRate = spotRate;
    this._direction = direction;
    this._notional = notional;
    this._dealtCurrency = dealtCurrency;
  }

  get currencyPair():String {
    return this._currencyPair;
  }

  get spotRate():Number {
    return this._spotRate;
  }

  get direction():Direction {
    return this._direction;
  }

  get notional():Number {
    return this._notional;
  }

  get dealtCurrency():String {
    return this._dealtCurrency;
  }
}
