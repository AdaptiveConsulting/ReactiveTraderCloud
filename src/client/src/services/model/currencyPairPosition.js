export default class CurrencyPairPosition {
  _symbol:string;
  _ccy:string;
  _basePnl:number;
  _baseTradedAmount:number;

  constructor(symbol:string, basePnl:number, baseTradedAmount:number) {
    this._symbol = symbol;
    this._ccy = symbol.length === 6 ? symbol.substr(0, 3) : '';
    this._basePnl = basePnl;
    this._baseTradedAmount = baseTradedAmount;
  }

  static get basePnlName() {
    return 'basePnl'; // matches basePnl prop name
  }

  static get baseTradedAmountName() {
    return 'baseTradedAmount'; // matches baseTradedAmount prop name
  }

  get symbol():string {
    return this._symbol;
  }

  get ccy():string {
    return this._ccy;
  }

  get basePnl():number {
    return this._basePnl;
  }

  get baseTradedAmount():number {
    return this._baseTradedAmount;
  }
}
