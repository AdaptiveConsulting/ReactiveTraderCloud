import { concat, OperatorFunction, race, timer } from "rxjs"
import { mapTo, publish } from "rxjs/operators"

export const emitTooLongMessage = <M, T>(
  ms: number,
  message: M,
): OperatorFunction<T, M | T> =>
  publish((multicasted$) =>
    race([multicasted$, concat(timer(ms).pipe(mapTo(message)), multicasted$)]),
  )
