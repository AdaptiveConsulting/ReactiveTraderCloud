import { newTrades$, Trade, TradeStatus } from "@/services/trades"
import { filter } from "rxjs/operators"

const sendNotification = (
  trade: Trade,
  registration?: ServiceWorkerRegistration,
) => {
  const tradeNotification = {
    ...trade,
    valueDate: trade.valueDate.toString(),
    tradeDate: trade.tradeDate.toString(),
    notional: trade.notional.toPrecision(2),
  }

  const status =
    tradeNotification.status === TradeStatus.Done ? "Accepted" : "Rejected"
  const title = `Trade ${status}: ID ${tradeNotification.tradeId}`
  const body = `${tradeNotification.direction} ${
    tradeNotification.dealtCurrency
  } ${tradeNotification.notional} vs ${tradeNotification.symbol.substr(3)} @ ${
    tradeNotification.spotRate
  }`

  const icon =
    navigator.userAgent.indexOf("Chrome") !== -1 &&
    navigator.userAgent.indexOf("Win") !== -1
      ? "./static/media/reactive-trader-icon-no-bkgd-256x256.png"
      : "./static/media/reactive-trader-icon-dark-256x256.png" // MacOS & Firefox notifications have white backgrounds, so use dark backgrounded icon

  const options: NotificationOptions = {
    body: body,
    icon: icon,
    dir: "ltr",
    data: tradeNotification,
    tag: "trade",
  }

  if (registration) {
    registration.showNotification(title, options)
  } else {
    new Notification(title, options)
  }
}

const relevantTrades$ = newTrades$.pipe(
  filter((trade) => trade.status !== TradeStatus.Pending),
)

const notificationsGranted = () =>
  new Promise<void>((res, rej) => {
    if (!("Notification" in window)) rej()

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "denied") {
          rej()
        } else {
          res()
        }
      })
    } else {
      if (Notification.permission === "granted") {
        res()
      } else {
        rej()
      }
    }
  })

export async function registerSwNotifications() {
  try {
    await notificationsGranted()
    const registration = await ("serviceWorker" in navigator
      ? navigator.serviceWorker.ready
      : Promise.resolve(undefined))

    relevantTrades$.subscribe(
      (trade) => {
        sendNotification(trade, registration)
      },
      (e) => {
        console.error(e)
      },
      () => {
        console.error("notifications stream completed!?")
      },
    )
  } catch (_) {
    console.log("Notification permission was not granted.")
  }
}
