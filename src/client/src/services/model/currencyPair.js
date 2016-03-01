export default class CurrencyPair {
  _symbol:String;
  _ratePrecision:Number;
  _pipsPosition:Number;

  constructor(symbol:String, ratePrecision:Number, pipsPosition:Number) {
    this._symbol = symbol;
    this._ratePrecision = ratePrecision;
    this._pipsPosition = pipsPosition;
  }

  get symbol():String {
    return this._symbol;
  }

  get ratePrecision():Number {
    return this._ratePrecision;
  }

  get pipsPosition():Number {
    return this._pipsPosition;
  }
}
