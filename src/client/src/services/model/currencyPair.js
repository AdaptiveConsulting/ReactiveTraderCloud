export default class CurrencyPair {
  _symbol:string;
  _base:string;
  _terms:string;
  _ratePrecision:number;
  _pipsPosition:number;
  _displayString:string;

  constructor(symbol:string, ratePrecision:number, pipsPosition:number) {
    this._symbol = symbol;
    this._ratePrecision = ratePrecision;
    this._pipsPosition = pipsPosition;

    this._base = symbol.substr(0 , 3);
    this._terms = symbol.substr(3 , 3);
    this._displayString = `${this._base}/${this._terms}`;
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
    return this._base;
  }

  get terms():string {
    return this._terms;
  }

  get displayString() {
    return this._displayString;
  }
}
