import { bind } from "@react-rxjs/core"
import { EMPTY, of, timer } from "rxjs"
import { ajax } from "rxjs/ajax"
import { catchError, map, switchMap } from "rxjs/operators"

const [useLatency] = bind(
  timer(0, 10000).pipe(
    switchMap(() => {
      const start = new Date().getTime()
      return ajax("https://api.publicapis.org/entries").pipe(
        map(() => {
          const stop = new Date().getTime()
          return stop - start
        }),
        catchError((e) => {
          console.log("Error pinging echo service", e)
          return of(0)
        }),
      )
    }),
  ),
)

export const Latency = () => {
  const latency = useLatency()
  return latency ? <div>Latency: {latency}ms</div> : null
}
