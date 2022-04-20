import { EchoService } from "@/generated/TradingGateway"
import { withConnection } from "@/services/withConnection"
import { bind } from "@react-rxjs/core"
import { EMPTY, timer } from "rxjs"
import { catchError, map, switchMap } from "rxjs/operators"

let count = 0
const [useLatency] = bind(
  timer(0, 1000).pipe(
    withConnection(),
    switchMap(() => {
      const start = new Date().getTime()
      return EchoService.echo({ payload: count++ }).pipe(
        map(() => {
          const stop = new Date().getTime()
          return stop - start
        }),
        catchError((e) => {
          console.log("Error pinging echo service", e)
          return EMPTY
        }),
      )
    }),
  ),
  null,
)

export const Latency = () => {
  const latency = useLatency()
  return latency ? (
    <div>
      UI Latency: <span>{latency}ms</span>
    </div>
  ) : null
}
