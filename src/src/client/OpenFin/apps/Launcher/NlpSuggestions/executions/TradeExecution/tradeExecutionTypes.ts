import { Direction } from "@/generated/TradingGateway"
import { ExecutionTrade } from "@/services/executions"

export enum TradeNlpExecutionStatus {
  MissingData = 1,
  DataReady = 2,
  WaitingToExecute = 3,
  Executing = 4,
  Done = 5,
}

export interface RequestData {
  symbol: string
  notional: number
  direction: Direction
}

export interface TradeNlpExecutionMissingData {
  type: TradeNlpExecutionStatus.MissingData
  payload: Record<string, unknown>
}

export interface TradeNlpExecutionDataReady {
  type: TradeNlpExecutionStatus.DataReady
  payload: {
    requestData: RequestData
  }
}

export interface TradeNlpExecutionWaitingToExecute {
  type: TradeNlpExecutionStatus.WaitingToExecute
  payload: {
    requestData: RequestData
  }
}

export interface TradeNlpExecutionExecuting {
  type: TradeNlpExecutionStatus.Executing
  payload: {
    requestData: RequestData
  }
}

export interface TradeNlpExecutionDone {
  type: TradeNlpExecutionStatus.Done
  payload: {
    requestData: RequestData
    response:
      | { type: "ok"; trade: ExecutionTrade }
      | { type: "ko"; reason: string }
  }
}

export type TradeNlpExecutionState =
  | TradeNlpExecutionMissingData
  | TradeNlpExecutionDataReady
  | TradeNlpExecutionWaitingToExecute
  | TradeNlpExecutionExecuting
  | TradeNlpExecutionDone
