export default class CurrencyPair {
  _symbol:string;
  _ratePrecision:number;
  _pipsPosition:number;

  constructor(symbol:string, ratePrecision:number, pipsPosition:number) {
    this._symbol = symbol;
    this._ratePrecision = ratePrecision;
    this._pipsPosition = pipsPosition;
  }

  get symbol():string {
    return this._symbol;
  }

  get ratePrecision():number {
    return this._ratePrecision;
  }

  get pipsPosition():number {
    return this._pipsPosition;
  }

  get base():string {
    return this._symbol.substr(0 , 3);
  }

  get terms():string {
    return this._symbol.substr(3 , 3);
  }
}
