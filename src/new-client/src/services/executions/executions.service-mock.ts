import { Observable, race, Subject, timer } from "rxjs"
import { mapTo, tap } from "rxjs/operators"
import {
  ExecutionRequest,
  ExecutionTrade,
  ExecutionStatus,
  TimeoutExecution,
} from "./types"
import {
  DELAYED_CURRENCY,
  EXECUTION_TIMEOUT_VALUE,
  REJECTED_CURRENCY,
} from "@/services/executions/constants"

const executionsSubject = new Subject<ExecutionTrade>()

let id = 1

export const execute$ = (
  execution: ExecutionRequest,
): Observable<ExecutionTrade | TimeoutExecution> => {
  const time =
    execution.currencyPair === DELAYED_CURRENCY ? 4_000 : Math.random() * 2_000
  const status: ExecutionStatus.Done | ExecutionStatus.Rejected =
    execution.currencyPair === REJECTED_CURRENCY
      ? ExecutionStatus.Rejected
      : ExecutionStatus.Done

  const execution$: Observable<ExecutionTrade> = timer(time).pipe(
    mapTo({
      ...execution,
      tradeId: id++,
      status,
      valueDate: new Date(),
      tradeDate: new Date(),
    }),
    tap((exec) => {
      executionsSubject.next(exec)
    }),
  )

  const timeout$ = timer(EXECUTION_TIMEOUT_VALUE).pipe(
    mapTo({
      ...execution,
      status: ExecutionStatus.Timeout,
    } as TimeoutExecution),
  )

  return race([execution$, timeout$])
}

export const executions$ = executionsSubject.asObservable()
