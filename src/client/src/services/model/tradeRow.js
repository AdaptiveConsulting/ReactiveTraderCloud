import Trade from './trade';

export default class TradeRow {
  _isNew: boolean;
  _isInFocus: boolean;
  _trade: Trade;

  constructor(trade: Trade) {
    this._trade = trade;
  }

  get trade(): Trade {
    return this._trade;
  }

  set trade(val: Trade) {
    this._trade = val;
  }

  get isNew():boolean {
    return this._isNew;
  }

  set isNew(val: boolean) {
    this._isNew = val;
  }

  get isInFocus():boolean {
    return this._isInFocus;
  }

  set isInFocus(val: boolean) {
    this._isInFocus = val;
  }
}
