import { BehaviorSubject, EMPTY, of, race, Subject, timer } from "rxjs"
import { catchError, map, switchMap, take, tap } from "rxjs/operators"
import { checkLimitFn } from "./types"

const limitCheckSubscriptionUuid$ = new BehaviorSubject<string | null>(null)

const setLimitCheckSubscriber = (uuid: string, topic: string) => {
  if (topic === LIMIT_CHECKER_STATUS_CHANNEL) {
    console.info(LOG_NAME, `${uuid} has subscribed as a limit checker`)
    limitCheckSubscriptionUuid$.next(uuid)
  }
}

const REQUEST_LIMIT_CHECK_CHANNEL = "request-limit-check"
const LIMIT_CHECKER_STATUS_CHANNEL = "limit-check-status"
const CLIENT_STATUS_CHANNEL = "client-status"
const LOG_NAME = "Finsemble: "

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

      const limitCheckResponse = (result: boolean) => {
        console.info(LOG_NAME, `${uuid}Limit check response was ${result}`)
        obs.next(result)
        obs.complete()
      }

      const payload = {
        ...message,
        id: limitCheckId++,
      }

      window.FSBL.Clients.RouterClient.query(
        REQUEST_LIMIT_CHECK_CHANNEL,
        payload,
        function (error: {}, response: { data: { result: boolean } }) {
          if (!error) {
            const result = response.data.result
            console.info(
              LOG_NAME,
              `Responder Query Response Response: ${result}`,
            )
            limitCheckResponse(result)
          }
        },
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
      ])
    }),
  )

window.FSBL.Clients.RouterClient.transmit(CLIENT_STATUS_CHANNEL, "ALIVE")
window.FSBL.Clients.RouterClient.addListener(
  LIMIT_CHECKER_STATUS_CHANNEL,
  function (error: {}, response: { data: string }) {
    if (error) {
      console.error(
        LOG_NAME,
        "Finsemble Channel error: " + JSON.stringify(error),
      )
    } else {
      console.info(
        LOG_NAME,
        "Finsemble Channel Response: " + JSON.stringify(response),
      )
      setLimitCheckSubscriber(response.data, LIMIT_CHECKER_STATUS_CHANNEL)
    }
  },
)
