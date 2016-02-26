export default class CurrencyPairPosition {
  private _symbol:string;
  private _basePnl:Number;
  private _baseTradedAmount:Number;

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
