import { race, Subject, timer } from "rxjs"
import { map, mapTo, tap } from "rxjs/operators"
import {
  ExecutionRequest,
  ExecutionTrade,
  ExecutionStatus,
  TimeoutExecution,
} from "./types"
import {
  ExecuteTradeRequest,
  ExecutionService,
  ExecutionResponse,
} from "@/generated/TradingGateway"
import { TradeStatus } from "../trades"

const mapExecutionToPayload = (e: ExecutionRequest): ExecuteTradeRequest => {
  return {
    currencyPair: e.currencyPair,
    spotRate: e.spotRate,
    direction: e.direction,
    notional: e.notional,
    dealtCurrency: e.dealtCurrency,
    valueDate: new Date().toISOString(), // TODO: talk with hydra team about this
  }
}

const mapResponseToTrade =
  (id: string) =>
  ({ trade }: ExecutionResponse): ExecutionTrade => {
    if (trade.status === TradeStatus.Pending) throw new Error("wait what?!") // TODO: talk with hydra team

    return {
      currencyPair: trade.currencyPair,
      dealtCurrency: trade.dealtCurrency,
      direction: trade.direction,
      notional: trade.notional,
      spotRate: trade.spotRate,
      status: ExecutionStatus[trade.status],
      tradeId: Number(trade.tradeId), // TODO: talk with hydra team
      valueDate: trade.valueDate,
      id,
    }
  }

const executionsSubject = new Subject<ExecutionTrade>()

export const execute$ = (execution: ExecutionRequest) =>
  race([
    ExecutionService.executeTrade(mapExecutionToPayload(execution)).pipe(
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
