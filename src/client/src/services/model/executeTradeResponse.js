import { Trade } from './';

export default class ExecuteTradeResponse {
  _trade:Trade;
  _error:string;
  _hasError:boolean;

  static createForError(error:string) {
    return new ExecuteTradeResponse(null, error, true);
  }

  static create(trade:Trade) {
    return new ExecuteTradeResponse(trade, '', false);
  }

  constructor(trade:Trade, error:string, hasError:boolean) {
    this._trade = trade;
    this._error = error;
    this._hasError = hasError;
  }

  get trade():Trade {
    return this._trade;
  }

  get error():string {
    return this._error;
  }

  get hasError():boolean {
    return this._hasError;
  }
}

