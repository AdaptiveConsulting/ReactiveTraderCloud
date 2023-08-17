import { AckCreateRfqResponse, Direction } from "generated/TradingGateway"

export enum RfqNlpExecutionStatus {
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
  maturity: string
}

export interface RfqNlpExecutionMissingData {
  type: RfqNlpExecutionStatus.MissingData
  payload: Record<string, unknown>
}

export interface RfqNlpExecutionDataReady {
  type: RfqNlpExecutionStatus.DataReady
  payload: {
    requestData: RequestData
  }
}

export interface RfqNlpExecutionWaitingToExecute {
  type: RfqNlpExecutionStatus.WaitingToExecute
  payload: {
    requestData: RequestData
  }
}

export interface RfqNlpExecutionExecuting {
  type: RfqNlpExecutionStatus.Executing
  payload: {
    requestData: RequestData
  }
}

export interface RfqNlpExecutionDone {
  type: RfqNlpExecutionStatus.Done
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
