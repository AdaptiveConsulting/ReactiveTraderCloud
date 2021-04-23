import { race, Subject, timer } from "rxjs"
import { map, mapTo, tap } from "rxjs/operators"
import { getRemoteProcedureCall$ } from "@/services/client"
import {
  ExecutionRequest,
  ExecutionPayload,
  ExecutionResponse,
  ExecutionTrade,
  ExecutionStatus,
  TimeoutExecution,
} from "./types"

const mapExecutionToPayload = (e: ExecutionRequest): ExecutionPayload => {
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

const executionsSubject = new Subject<ExecutionTrade>()

export const execute$ = (execution: ExecutionRequest) =>
  race([
    getRemoteProcedureCall$<ExecutionResponse, ExecutionPayload>(
      "execution",
      "executeTrade",
      mapExecutionToPayload(execution),
    ).pipe(
      map(mapResponseToTrade(execution.id)),
      tap((value) => {
        executionsSubject.next(value)
      }),
    ),
    timer(30_000).pipe(
      mapTo({
        ...execution,
        status: ExecutionStatus.Timeout,
      } as TimeoutExecution),
    ),
  ])

export const executions$ = executionsSubject.asObservable()
