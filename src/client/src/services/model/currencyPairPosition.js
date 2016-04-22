import CurrencyPair from './currencyPair';

export default class CurrencyPairPosition {
  _symbol:string;
  _currencyPair:CurrencyPair;
  _basePnl:number;
  _baseTradedAmount:number;

  constructor(symbol:string, basePnl:number, baseTradedAmount:number, currencyPair:CurrencyPair) {
    this._symbol = symbol;
    this._currencyPair = currencyPair;
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

  get currencyPair():string {
    return this._currencyPair;
  }

  get basePnl():number {
    return this._basePnl;
  }

  get baseTradedAmount():number {
    return this._baseTradedAmount;
  }
}
