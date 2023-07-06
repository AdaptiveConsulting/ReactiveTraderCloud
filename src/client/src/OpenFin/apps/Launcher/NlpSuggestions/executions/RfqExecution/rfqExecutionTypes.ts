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

export interface RfqNlpExecutionMissingData {
  type: NlpExecutionStatus.MissingData
  payload: Record<string, unknown>
}

export interface RfqNlpExecutionDataReady {
  type: NlpExecutionStatus.DataReady
  payload: {
    requestData: RequestData
  }
}

export interface RfqNlpExecutionWaitingToExecute {
  type: NlpExecutionStatus.WaitingToExecute
  payload: {
    requestData: RequestData
  }
}

export interface RfqNlpExecutionExecuting {
  type: NlpExecutionStatus.Executing
  payload: {
    requestData: RequestData
  }
}

export interface RfqNlpExecutionDone {
  type: NlpExecutionStatus.Done
  payload: {
    requestData: RequestData
    response:
      | { type: "ack"; response: AckCreateRfqResponse }
      | { type: "nack"; reason: string }
  }
}

export type RfqNlpExecutionState =
  | RfqNlpExecutionMissingData
  | RfqNlpExecutionDataReady
  | RfqNlpExecutionWaitingToExecute
  | RfqNlpExecutionExecuting
  | RfqNlpExecutionDone
