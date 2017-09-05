import Trade from './trade'

export default class TradeRow {

  constructor(trade: Trade) {
    this._trade = trade
  }

  _isNew: boolean

  get isNew(): boolean {
    return this._isNew
  }

  set isNew(val: boolean) {
    this._isNew = val
  }

  _isInFocus: boolean

  get isInFocus(): boolean {
    return this._isInFocus
  }

  set isInFocus(val: boolean) {
    this._isInFocus = val
  }

  _trade: Trade

  get trade(): Trade {
    return this._trade
  }

  set trade(val: Trade) {
    this._trade = val
  }
}
