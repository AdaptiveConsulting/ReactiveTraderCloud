import { race, Subject, timer } from "rxjs"
import { delay, map, mapTo, tap } from "rxjs/operators"
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
import {
  EXECUTION_DELAY_VALUE,
  DELAYED_CURRENCY,
  EXECUTION_TIMEOUT_VALUE,
} from "@/services/executions/constants"

const mapExecutionToPayload = (e: ExecutionRequest): ExecuteTradeRequest => {
  return {
    currencyPair: e.currencyPair,
    spotRate: e.spotRate,
    direction: e.direction,
    notional: e.notional,
    dealtCurrency: e.dealtCurrency,
    valueDate: new Date().toISOString().substr(0, 10), // TODO: talk with hydra team about this
  }
}

const mapResponseToTrade =
  (id: string) =>
  ({ trade }: ExecutionResponse): ExecutionTrade => {
    // Decision was taken not to have a pending state from Hydra
    if (trade.status === TradeStatus.Pending) throw new Error("wait what?!")

    return {
      currencyPair: trade.currencyPair,
      dealtCurrency: trade.dealtCurrency,
      direction: trade.direction,
      notional: trade.notional,
      spotRate: trade.spotRate,
      status: ExecutionStatus[trade.status],
      tradeId: Number(trade.tradeId), // TODO: talk with hydra team
      tradeDate: new Date(),
      valueDate: new Date(trade.valueDate),
      id,
    }
  }

const executionsSubject = new Subject<ExecutionTrade>()

export const execute$ = (execution: ExecutionRequest) =>
  race([
    ExecutionService.executeTrade(mapExecutionToPayload(execution)).pipe(
      delay(
        execution.currencyPair === DELAYED_CURRENCY ? EXECUTION_DELAY_VALUE : 0,
      ),
      map(mapResponseToTrade(execution.id)),
      tap((value) => {
        executionsSubject.next(value)
      }),
    ),
    timer(EXECUTION_TIMEOUT_VALUE).pipe(
      mapTo({
        ...execution,
        status: ExecutionStatus.Timeout,
      } as TimeoutExecution),
    ),
  ])

export const executions$ = executionsSubject.asObservable()
