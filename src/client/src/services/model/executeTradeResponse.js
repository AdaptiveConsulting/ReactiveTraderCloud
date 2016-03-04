import { Trade } from './';

export default class ExecuteTradeResponse {
  _trade:Trade;
  _error:String;
  _hasError:Boolean;

  static createForError(error:String) {
    return new ExecuteTradeResponse(null, error, true);
  }

  static create(trade:Trade) {
    return new ExecuteTradeResponse(trade, '', false);
  }

  constructor(trade:Trade, error:String, hasError:Boolean) {
    this._trade = trade;
    this._error = error;
    this._hasError = hasError;
  }

  get trade():Trade {
    return this._trade;
  }

  get error():String {
    return this._error;
  }

  get hasError():Boolean {
    return this._hasError;
  }
}

