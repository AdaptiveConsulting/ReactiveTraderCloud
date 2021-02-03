import { race, timer } from "rxjs"
import { map, mapTo } from "rxjs/operators"
import { getRemoteProcedureCall$ } from "services/client"
import {
  ExecutionRequest,
  ExecutionPayload,
  ExecutionResponse,
  ExecutionTrade,
  ExecutionStatus,
  TimeoutExecution,
} from "./types"

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
