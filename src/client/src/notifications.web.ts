import { ExecutionStatus, ExecutionTrade } from "@/services/executions"
import { executions$ } from "@/services/executions/executions"
import { formatNumber } from "@/utils"
import { Subscription } from "rxjs"
import { QuoteDetails, lastQuoteReceived$ } from "./services/credit"

const sendNotification = (executionTrade: ExecutionTrade) => {
  const notification = {
    ...executionTrade,
    valueDate: executionTrade.valueDate.toString(),
    tradeDate: executionTrade.valueDate.toString(),
  }

  const status =
    notification.status === ExecutionStatus.Done ? "Accepted" : "Rejected"
  const title = `Trade ${status}: ID ${notification.tradeId}`
  const body = `${notification.direction} ${
    notification.dealtCurrency
  } ${formatNumber(
    notification.notional,
  )} vs ${notification.currencyPair.substr(3)} @ ${notification.spotRate}`

  const icon =
    navigator.userAgent.indexOf("Chrome") !== -1 &&
    navigator.userAgent.indexOf("Win") !== -1
      ? "./static/media/reactive-trader-icon-no-bkgd-256x256.png"
      : "./static/media/reactive-trader-icon-dark-256x256.png" // MacOS & Firefox notifications have white backgrounds, so use dark backgrounded icon

  const options: NotificationOptions = {
    body: body,
    icon: icon,
    dir: "ltr",
    data: notification,
    // tag: "trade", TODO: investigate why this field causes malfunctions on certain versions of chrome
  }

  new Notification(title, options)
}

const sendCreditQuoteNotification = (quote: QuoteDetails) => {
  const title = `Quote Received: RFQ ID ${quote.rfqId} from ${quote.dealer?.name}`
  const body = `${quote.direction} ${quote.instrument?.name} ${formatNumber(
    quote.quantity,
  )} @ $${formatNumber(quote.price)}`

  const icon =
    navigator.userAgent.indexOf("Chrome") !== -1 &&
    navigator.userAgent.indexOf("Win") !== -1
      ? "./static/media/reactive-trader-icon-no-bkgd-256x256.png"
      : "./static/media/reactive-trader-icon-dark-256x256.png" // MacOS & Firefox notifications have white backgrounds, so use dark backgrounded icon

  const options: NotificationOptions = {
    body: body,
    icon: icon,
    dir: "ltr",
    data: quote,
    // tag: "trade", TODO: investigate why this field causes malfunctions on certain versions of chrome
  }

  new Notification(title, options)
}

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

export async function registerNotifications() {
  try {
    await notificationsGranted()
    console.log("Notifications permission granted.")

    executions$.subscribe(
      (executionTrade) => {
        sendNotification(executionTrade)
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

let quotesReceivedSubscription: Subscription | null = null

export async function registerCreditNotifications() {
  try {
    await notificationsGranted()
    console.log("Notifications permission granted.")

    quotesReceivedSubscription = lastQuoteReceived$.subscribe(
      (quote) => {
        sendCreditQuoteNotification(quote)
      },
      (e) => {
        console.error(e)
      },
      () => {
        console.error("credit quote notifications stream completed!?")
      },
    )
  } catch (_) {
    console.log("Notification permission was not granted.")
  }
}

export function unregisterCreditNotifications() {
  if (quotesReceivedSubscription) {
    quotesReceivedSubscription.unsubscribe()
  }
}
