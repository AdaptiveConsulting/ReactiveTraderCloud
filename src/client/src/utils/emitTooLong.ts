import { OperatorFunction, race, concat, timer } from "rxjs"
import { publish, mapTo } from "rxjs/operators"

export const emitTooLongMessage = <M, T>(
  ms: number,
  message: M,
): OperatorFunction<T, M | T> =>
  publish((multicasted$) =>
    race([multicasted$, concat(timer(ms).pipe(mapTo(message)), multicasted$)]),
  )
