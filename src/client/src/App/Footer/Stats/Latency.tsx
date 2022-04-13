import { EchoService } from "@/generated/TradingGateway"
import { bind } from "@react-rxjs/core"
import { of, timer } from "rxjs"
import { ajax } from "rxjs/ajax"
import { catchError, map, switchMap } from "rxjs/operators"

const [useLatency] = bind(
  timer(0, 10000).pipe(
    switchMap(() => {
      const start = new Date().getTime()
      return EchoService.echo({ payload: new Date().getTime() }).pipe(
        map(() => {
          const stop = new Date().getTime()
          return stop - start
        }),
        catchError((e) => {
          console.log("Error pinging echo service", e)
          return of(undefined)
        }),
      )
    }),
  ),
)

export const Latency = () => {
  const latency = useLatency()
  return latency ? (
    <div>
      UI Latency: <span>{latency}ms</span>
    </div>
  ) : null
}
