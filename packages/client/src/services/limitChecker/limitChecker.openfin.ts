import { bind } from "@react-rxjs/core"
import { BehaviorSubject, of, race, Subject, timer } from "rxjs"
import { map, switchMap, take, tap } from "rxjs/operators"

import { CheckLimitStreamGenerator } from "./types"

if (window.fdc3) {
  window.fdc3.addContextListener("limit-checker-status", (context) => {
    if (context.id) limitCheckSubscription$.next(context.id.isAlive)
  })
}

const limitCheckSubscription$ = new BehaviorSubject<string>("false")

export const [useIsLimitCheckerRunning, isLimitCheckerRunning$] = bind<boolean>(
  limitCheckSubscription$.pipe(map((isAlive) => isAlive === "true")),
)

const LOG_NAME = "OpenFin: "

let limitCheckId = 0

export const checkLimit$: CheckLimitStreamGenerator = (message: {
  tradedCurrencyPair: string
  notional: number
  rate: number
}) =>
  isLimitCheckerRunning$.pipe(
    take(1),
    switchMap((isAlive) => {
      if (!isAlive) {
        return of(true)
      }

      const payload = {
        notional: message.notional.toString(),
        rate: message.rate.toString(),
        tradedCurrencyPair: message.tradedCurrencyPair,
        id: (limitCheckId++).toString(),
      }

      const result$ = new Subject<string>()

      const listener = window.fdc3.addContextListener(
        `result-${payload.id}`,
        (context) => {
          if (context.id) {
            result$.next(context.id.result)
          }
        },
      )

      window.fdc3.broadcast({ type: "check-limit", id: payload })

      return race([
        result$.pipe(
          take(1),
          map((result) => result === "true"),
        ),
        timer(3000).pipe(
          map(() => {
            console.info(
              LOG_NAME,
              "limit check timed out, removing subscription",
            )
            return true
          }),
        ),
      ]).pipe(tap(listener.unsubscribe))
    }),
  )
