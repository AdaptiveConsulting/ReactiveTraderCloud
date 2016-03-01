export default class CurrencyPairPosition {
  _symbol:string;
  _basePnl:Number;
  _baseTradedAmount:Number;

  constructor(symbol:string, basePnl:Number, baseTradedAmount:Number) {
    this._symbol = symbol;
    this._basePnl = basePnl;
    this._baseTradedAmount = baseTradedAmount;
  }

  get symbol():string {
    return this._symbol;
  }

  get basePnl():Number {
    return this._basePnl;
  }

  get baseTradedAmount():Number {
    return this._baseTradedAmount;
  }
}
