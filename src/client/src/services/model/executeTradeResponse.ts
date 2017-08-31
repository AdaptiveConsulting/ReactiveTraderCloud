import Trade from './trade'

export default class ExecuteTradeResponse {
  constructor(trade, error, hasError) {
    this._trade = trade
    this._error = error
    this._hasError = hasError
  }

  _trade: Trade

  get trade() {
    return this._trade
  }

  _error: string

  get error() {
    return this._error
  }

  _hasError: boolean

  get hasError() {
    return this._hasError
  }

  static createForError(error: string, request) {
    return new ExecuteTradeResponse(request, error, true)
  }

  static create(trade: Trade) {
    return new ExecuteTradeResponse(trade, '', false)
  }
}

