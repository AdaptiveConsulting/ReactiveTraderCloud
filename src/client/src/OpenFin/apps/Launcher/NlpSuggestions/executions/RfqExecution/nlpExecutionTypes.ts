import { AckCreateRfqResponse, Direction } from "@/generated/TradingGateway"

export enum NlpExecutionStatus {
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

export interface NlpExecutionMissingData {
  type: NlpExecutionStatus.MissingData
  payload: Record<string, unknown>
}

export interface NlpExecutionDataReady {
  type: NlpExecutionStatus.DataReady
  payload: {
    requestData: RequestData
  }
}

export interface NlpExecutionWaitingToExecute {
  type: NlpExecutionStatus.WaitingToExecute
  payload: {
    requestData: RequestData
  }
}

export interface NlpExecutionExecuting {
  type: NlpExecutionStatus.Executing
  payload: {
    requestData: RequestData
  }
}

export interface NlpExecutionDone {
  type: NlpExecutionStatus.Done
  payload: {
    requestData: RequestData
    response:
      | { type: "ack"; response: AckCreateRfqResponse }
      | { type: "nack"; reason: string }
  }
}

export type NlpExecutionState =
  | NlpExecutionMissingData
  | NlpExecutionDataReady
  | NlpExecutionWaitingToExecute
  | NlpExecutionExecuting
  | NlpExecutionDone
