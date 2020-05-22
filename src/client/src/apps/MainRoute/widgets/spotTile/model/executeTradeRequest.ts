import { Direction, Trade } from 'rt-types'

export interface ExecuteTradeRequest extends Object {
  id: string
  CurrencyPair: string
  SpotRate: number
  Direction: Direction
  Notional: number
  DealtCurrency: string
}

export interface TradeSuccessResponse {
  hasError: false
  hasWarning: false
  trade: Trade
  request: ExecuteTradeRequest
}

export interface TradeErrorResponse {
  hasError: true
  hasWarning: false
  error: string
  request: ExecuteTradeRequest
}

export interface TradeWarningResponse {
  hasError: false
  hasWarning: true
  warning: string
  request: ExecuteTradeRequest
}

export type ExecuteTradeResponse = TradeErrorResponse | TradeSuccessResponse | TradeWarningResponse

export const createExecuteTradeResponseForWarning = (
  warning: string,
  request: ExecuteTradeRequest
): TradeWarningResponse => ({
  warning,
  request,
  hasError: false,
  hasWarning: true
})

export const createExecuteTradeResponseForError = (
  error: string,
  request: ExecuteTradeRequest
): TradeErrorResponse => ({
  error,
  request,
  hasError: true,
  hasWarning: false
})

export const createExecuteTradeResponse = (
  trade: Trade,
  request: ExecuteTradeRequest
): TradeSuccessResponse => ({
  trade,
  request,
  hasError: false,
  hasWarning: false
})
