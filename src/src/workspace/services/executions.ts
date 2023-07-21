import { delay, firstValueFrom, of, Subject, switchMap, tap } from "rxjs"

import {
  ExecuteTradeRequest,
  ExecutionResponse,
  ExecutionService,
} from "@/generated/TradingGateway"

export const executing$ = new Subject<ExecuteTradeRequest>()
export const executionResponse$ = new Subject<ExecutionResponse>()

// Must return a promise to execute properly from the context of CLIProvider.onSelection
export const execute = async (execution: ExecuteTradeRequest) => {
  executing$.next(execution)
  return firstValueFrom(
    of(null).pipe(
      delay(2000),
      switchMap(() => ExecutionService.executeTrade(execution)),
      tap((response) => executionResponse$.next(response!)),
    ),
  )
}
