import { BehaviorSubject, of, race, Subject, timer } from "rxjs"
import { map, switchMap, take, tap } from "rxjs/operators"
import { checkLimitFn } from "./types"

const limitCheckSubscriptionUuid$ = new BehaviorSubject<string | null>(null)

const setLimitCheckSubscriber = (uuid: string, topic: string) => {
  if (topic === REQUEST_LIMIT_CHECK_TOPIC) {
    console.info(LOG_NAME, `${uuid} has subscribed as a limit checker`)
    limitCheckSubscriptionUuid$.next(uuid)
  }
}

const removeLimitCheckSubscriber = (uuid: string, topic: string) => {
  if (topic === REQUEST_LIMIT_CHECK_TOPIC) {
    console.info(LOG_NAME, `${uuid} has unsubscribed as a limit checker`)
    limitCheckSubscriptionUuid$.next(null)
  }
}

const REQUEST_LIMIT_CHECK_TOPIC = "request-limit-check"
const LIMIT_CHECKER_UUID = "LIMIT-CHECKER"
const LIMIT_CHECKER_STATUS_TOPIC = "request-limit-check-status"
const LOG_NAME = "OpenFin: "
let limitCheckId = 1

export const checkLimit$: checkLimitFn = (message: {
  tradedCurrencyPair: string
  notional: number
  rate: number
}) =>
  limitCheckSubscriptionUuid$.pipe(
    take(1),
    switchMap((uuid) => {
      if (uuid === null) {
        console.info(
          LOG_NAME,
          "client side limit check not up, will delegate to server",
        )
        return of(true)
      }

      console.info(LOG_NAME, `checking if limit is ok with ${uuid}`)

      const obs = new Subject<boolean>()

      const limitCheckResponse = (msg: { result: boolean }) => {
        console.info(LOG_NAME, `${uuid} limit check response was`, msg)
        obs.next(msg.result)
      }

      const topic = `limit-check-response (${++limitCheckId})`

      fin.desktop.InterApplicationBus.subscribe(uuid, topic, limitCheckResponse)

      const payload = {
        ...message,
        id: limitCheckId,
        responseTopic: topic,
      }

      fin.desktop.InterApplicationBus.send(
        uuid,
        REQUEST_LIMIT_CHECK_TOPIC,
        payload,
      )

      // If limit checker hasn't responded in 3 seconds it has likely been closed, remove the subscription
      // An alternative would be to establish a heartbeat connection with the limit checker
      return race([
        obs.pipe(take(1)),
        timer(3000).pipe(
          map(() => {
            console.info(
              LOG_NAME,
              "limit check timed out, removing subscription",
            )
            limitCheckSubscriptionUuid$.next(null)
            return true
          }),
        ),
      ]).pipe(
        tap(() => {
          fin.desktop.InterApplicationBus.unsubscribe(
            uuid,
            topic,
            limitCheckResponse,
          )
        }),
      )
    }),
  )

fin.desktop.main(() => {
  fin.desktop.InterApplicationBus.addSubscribeListener(setLimitCheckSubscriber)
  fin.desktop.InterApplicationBus.addUnsubscribeListener(
    removeLimitCheckSubscriber,
  )
  fin.desktop.InterApplicationBus.subscribe(
    LIMIT_CHECKER_UUID,
    // TODO: figure out if OpenFin typings are wrong - looks like this parameter is optional in docs but required in typings
    // TODO: this is why I had to use this weird construct - make undefined look like string
    undefined as any as string,
    LIMIT_CHECKER_STATUS_TOPIC,
    (message, _) => {
      if (message === "ALIVE") {
        setLimitCheckSubscriber(LIMIT_CHECKER_UUID, REQUEST_LIMIT_CHECK_TOPIC)
      }
    },
  )
  fin.desktop.InterApplicationBus.send(
    LIMIT_CHECKER_UUID,
    LIMIT_CHECKER_STATUS_TOPIC,
    null,
  )
})
