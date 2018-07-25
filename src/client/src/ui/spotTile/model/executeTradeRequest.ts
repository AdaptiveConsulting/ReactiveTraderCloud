import { Direction } from '../../../rt-types/index'
import { ExecuteTradeRequest, Trade } from '../../../rt-types/index'

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

export function tradeSuccesful(response: ExecuteTradeResponse): response is TradeSuccessResponse {
  return !response.hasError
}

export function tradeError(response: ExecuteTradeResponse): response is TradeErrorResponse {
  return response.hasError
}

export type ExecuteTradeResponse = TradeErrorResponse | TradeSuccessResponse

export function createExecuteTradeResponseForError(error: string, request: ExecuteTradeRequest): TradeErrorResponse {
  return {
    error,
    request,
    hasError: true
  }
}

export function createExecuteTradeResponse(trade: Trade, request: ExecuteTradeRequest): TradeSuccessResponse {
  return {
    trade,
    hasError: false,
    request
  }
}
