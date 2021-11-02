import { Direction } from "../trades"

export interface TradeRaw {
  CurrencyPair: string
  DealtCurrency: string
  Direction: Direction
  Notional: number
  SpotRate: number
  Status: RawExecutionStatus
  TradeDate: string
  TradeId: number
  TraderName: string
  ValueDate: string
}

// This is what is returned from the server
export interface ExecutionResponse {
  Trade: TradeRaw
}

export interface ExecutionPayload {
  CurrencyPair: string
  DealtCurrency: string
  Direction: Direction
  Notional: number
  SpotRate: number
  id: string
}

export enum RawExecutionStatus {
  Done = "Done",
  Rejected = "Rejected",
}

export interface ExecutionRequest {
  id: string
  currencyPair: string
  dealtCurrency: string
  direction: Direction
  notional: number
  spotRate: number
}

export enum ExecutionStatus {
  Done = "Done",
  Rejected = "Rejected",
  Timeout = "Timeout",
  CreditExceeded = "CreditExceeded",
}

export interface ExecutionTrade extends ExecutionRequest {
  status: ExecutionStatus.Done | ExecutionStatus.Rejected
  tradeId: number
  valueDate: Date
  tradeDate: Date
}

export interface TimeoutExecution extends ExecutionRequest {
  status: ExecutionStatus.Timeout
}

export interface CreditExceededExecution extends ExecutionRequest {
  status: ExecutionStatus.CreditExceeded
}
