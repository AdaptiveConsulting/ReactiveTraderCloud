import Trade from './trade'

export default class TradesUpdate {

  constructor(isStateOfTheWorld: boolean, isStale: boolean, trades: Array<Trade>) {
    this._isStateOfTheWorld = isStateOfTheWorld
    this._isStale = isStale
    this._trades = trades
  }

  _isStateOfTheWorld: boolean

  get isStateOfTheWorld(): boolean {
    return this._isStateOfTheWorld
  }

  _isStale: boolean

  get isStale(): boolean {
    return this._isStale
  }

  _trades: Array<Trade>

  get trades(): Array<Trade> {
    return this._trades
  }
}
