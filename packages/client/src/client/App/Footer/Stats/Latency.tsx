import { bind } from "@react-rxjs/core"
import { EMPTY, timer } from "rxjs"
import { catchError, map, scan, switchMap } from "rxjs/operators"

import { Typography } from "@/client/components/Typography"
import { EchoService } from "@/generated/TradingGateway"
import { withConnection } from "@/services/withConnection"

let count = 0
const [useLatency, latency$] = bind(
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
  0,
)

const MAX_SECONDS = 30
export const [useLatencyHistory, latencyHistory$] = bind(
  latency$.pipe(
    scan(
      (acc, value) => {
        acc.push(value)
        if (acc.length > MAX_SECONDS) {
          acc.splice(0, 1)
        }
        return [...acc]
      },
      [0],
    ),
  ),
)

export const Latency = () => {
  const latency = useLatency()
  return latency ? (
    <Typography variant="Text sm/Regular">
      UI Latency: <span>{latency}ms</span>
    </Typography>
  ) : null
}
