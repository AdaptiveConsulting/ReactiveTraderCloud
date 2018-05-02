import { Direction } from '.'
import { ExecuteTradeRequest, Trade } from '.'

export interface ExecuteTradeRequest extends Object {
  CurrencyPair: string
  SpotRate: number
  Direction: Direction
  Notional: number
  DealtCurrency: string
}

export interface TradeSuccessResponse {
  hasError: false
  trade: Trade
  request: ExecuteTradeRequest
}

export interface TradeErrorResponse {
  hasError: true
  error: string
  request: ExecuteTradeRequest
}

export type ExecuteTradeResponse = TradeErrorResponse | TradeSuccessResponse

export function createExecuteTradeResponseForError(
  error: string,
  request: ExecuteTradeRequest
): TradeErrorResponse {
  return {
    error,
    request,
    hasError: true
  }
}

export function createExecuteTradeResponse(
  trade: Trade,
  request: ExecuteTradeRequest
): TradeSuccessResponse {
  return {
    trade,
    hasError: false,
    request
  }
}
