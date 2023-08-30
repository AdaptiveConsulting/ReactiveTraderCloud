import {
  ExecuteTradeRequest,
  ExecutionResponse,
  ExecutionService,
} from "generated/TradingGateway"
import { of, race, Subject, timer } from "rxjs"
import { map, mapTo, mergeMap, tap } from "rxjs/operators"
import { EXECUTION_TIMEOUT_VALUE } from "services/executions/constants"

import { checkLimit$ } from "../limitChecker/limitChecker"
import { TradeStatus } from "../trades"
import {
  CreditExceededExecution,
  ExecutionRequest,
  ExecutionStatus,
  ExecutionTrade,
  TimeoutExecution,
} from "./types"

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

const mapResponseToTrade = ({ trade }: ExecutionResponse): ExecutionTrade => {
  // Decision was taken not to have a pending state from Hydra
  if (trade.status === TradeStatus.Pending) throw new Error("wait what?!")

  return {
    currencyPair: trade.currencyPair,
    dealtCurrency: trade.dealtCurrency,
    direction: trade.direction,
    notional: trade.notional,
    spotRate: trade.spotRate,
    status: ExecutionStatus[trade.status],
    tradeId: Number(trade.status), // TODO: talk with hydra team
    tradeDate: new Date(),
    valueDate: new Date(trade.valueDate),
  }
}

const executionsSubject = new Subject<ExecutionTrade>()

export const execute$ = (execution: ExecutionRequest) =>
  race([
    checkLimit$({
      tradedCurrencyPair: execution.currencyPair,
      notional: execution.notional,
      rate: execution.spotRate,
    }).pipe(
      mergeMap((tradeWithinLimit) => {
        if (!tradeWithinLimit) {
          return of({
            ...execution,
            status: ExecutionStatus.CreditExceeded,
          } as CreditExceededExecution)
        }

        return ExecutionService.executeTrade(
          mapExecutionToPayload(execution),
        ).pipe(
          map(mapResponseToTrade),
          tap((trade) => {
            executionsSubject.next(trade)
          }),
        )
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
