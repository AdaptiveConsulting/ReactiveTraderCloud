import { delay, firstValueFrom, of, Subject, switchMap } from "rxjs"

import { ExecuteTradeRequest } from "@/generated/TradingGateway"
import { execute$ } from "@/services/executions"

export const executing$ = new Subject<ExecuteTradeRequest>()

// Must return a promise to execute properly from the context of CLIProvider.onSelection
export const execute = async (execution: ExecuteTradeRequest) => {
  executing$.next(execution)
  return firstValueFrom(
    of(null).pipe(
      delay(2000),
      switchMap(() => execute$(execution)),
    ),
  )
}
