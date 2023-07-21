import { delay, firstValueFrom, of, Subject, switchMap, tap } from "rxjs"

import { ExecuteTradeRequest } from "@/generated/TradingGateway"
import {
  execute$,
  ExecutionTrade,
  TimeoutExecution,
} from "@/services/executions"
import { CreditExceededExecution } from "@/services/executions/types"

export const executing$ = new Subject<ExecuteTradeRequest>()
export const executionResponse$ = new Subject<
  ExecutionTrade | CreditExceededExecution | TimeoutExecution
>()

// Must return a promise to execute properly from the context of CLIProvider.onSelection
export const execute = async (execution: ExecuteTradeRequest) => {
  executing$.next(execution)
  return firstValueFrom(
    of(null).pipe(
      delay(2000),
      switchMap(() => execute$(execution)),
      tap((response) => executionResponse$.next(response)),
    ),
  )
}
