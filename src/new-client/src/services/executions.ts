import { race, timer } from "rxjs"
import { map, mapTo } from "rxjs/operators"
import { getRemoteProcedureCall$ } from "./client"
import { Direction } from "./trades"

interface TradeRaw {
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
interface ExecutionResponse {
  Trade: TradeRaw
}

interface ExecutionPayload {
  CurrencyPair: string
  DealtCurrency: string
  Direction: Direction
  Notional: number
  SpotRate: number
  id: string
}

enum RawExecutionStatus {
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
}

export interface ExecutionTrade extends ExecutionRequest {
  status: ExecutionStatus.Done | ExecutionStatus.Rejected
  tradeId: number
  valueDate: string
}

export interface TimeoutExecution extends ExecutionRequest {
  status: ExecutionStatus.Timeout
}

const mapExecutiontoPayload = (e: ExecutionRequest): ExecutionPayload => {
  return {
    CurrencyPair: e.currencyPair,
    DealtCurrency: e.dealtCurrency,
    Direction: e.direction,
    Notional: e.notional,
    SpotRate: e.spotRate,
    id: e.id,
  }
}

const mapResponseToTrade = (id: string) => ({
  Trade,
}: ExecutionResponse): ExecutionTrade => {
  return {
    currencyPair: Trade.CurrencyPair,
    dealtCurrency: Trade.DealtCurrency,
    direction: Trade.Direction,
    notional: Trade.Notional,
    spotRate: Trade.SpotRate,
    status: ExecutionStatus[Trade.Status],
    tradeId: Trade.TradeId,
    valueDate: Trade.ValueDate,
    id,
  }
}

export const execute$ = (execution: ExecutionRequest) =>
  race([
    getRemoteProcedureCall$<ExecutionResponse, ExecutionPayload>(
      "execution",
      "executeTrade",
      mapExecutiontoPayload(execution),
    ).pipe(map(mapResponseToTrade(execution.id))),
    timer(30_000).pipe(
      mapTo({
        ...execution,
        status: ExecutionStatus.Timeout,
      } as TimeoutExecution),
    ),
  ])
