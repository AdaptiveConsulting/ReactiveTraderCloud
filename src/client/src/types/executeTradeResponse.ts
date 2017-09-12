import { Trade } from '.'

export interface ExecuteTradeResponse {
  trade: Trade | any
  error?: string
  hasError: boolean
}

export function createExecuteTradeResponseForError(error: string, request): ExecuteTradeResponse {
  return {
    error,
    trade: request,
    hasError: true,
  }
}

export function createExecuteTradeResponse(trade: Trade): ExecuteTradeResponse {
  return {
    trade,
    hasError: false,
  }
}
