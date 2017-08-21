export default class CurrencyPair {
  constructor(symbol: string, ratePrecision: number, pipsPosition: number) {
    this._symbol = symbol;
    this._ratePrecision = ratePrecision;
    this._pipsPosition = pipsPosition;
    this._base = symbol.substr(0, 3);
    this._terms = symbol.substr(3, 3);
    this._displayString = `${this._base}/${this._terms}`;
  }

  _symbol: string;

  get symbol(): string {
    return this._symbol;
  }

  _base: string;

  get base(): string {
    return this._base;
  }

  _terms: string;

  get terms(): string {
    return this._terms;
  }

  _ratePrecision: number;

  get ratePrecision(): number {
    return this._ratePrecision;
  }

  _pipsPosition: number;

  get pipsPosition(): number {
    return this._pipsPosition;
  }

  _displayString: string;

  get displayString() {
    return this._displayString;
  }
}
