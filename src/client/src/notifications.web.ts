import { Subscription } from "rxjs"

import { ExecutionStatus, ExecutionTrade } from "@/services/executions"
import { executions$ } from "@/services/executions/executions"
import { formatNumber } from "@/utils"

import {
  acceptedRfqWithQuote$,
  lastQuoteReceived$,
  QuoteDetails,
  RfqWithQuote,
} from "./services/credit"

const icon =
  navigator.userAgent.indexOf("Chrome") !== -1 &&
  navigator.userAgent.indexOf("Win") !== -1
    ? "./static/media/reactive-trader-icon-no-bkgd-256x256.png"
    : "./static/media/reactive-trader-icon-dark-256x256.png" // MacOS & Firefox notifications have white backgrounds, so use dark backgrounded icon

const sendFxTradeNotification = (executionTrade: ExecutionTrade) => {
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

  const options: NotificationOptions = {
    body,
    icon,
    dir: "ltr",
    data: notification,
    // tag: "trade", TODO: investigate why this field causes malfunctions on certain versions of chrome
  }

  new Notification(title, options)
}

const sendQuoteAcceptedNotification = ({ rfq, quote }: RfqWithQuote) => {
  const notification = {
    ...rfq,
  }

  const title = `Quote Accepted: ID ${notification.id}`

  const options: NotificationOptions = {
    body: `${notification.direction} ${notification.quantity} ${notification.instrument?.name} @ ${quote?.price}`,
    icon,
  }

  new Notification(title, options)
}

const sendCreditQuoteNotification = (quote: QuoteDetails) => {
  const title = `Quote Received: RFQ ID ${quote.rfqId} from ${quote.dealer?.name}`
  const body = `${quote.direction} ${quote.instrument?.name} ${formatNumber(
    quote.quantity,
  )} @ $${formatNumber(quote.price)}`

  const options: NotificationOptions = {
    body,
    icon,
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

export async function registerFxNotifications() {
  try {
    await notificationsGranted()
    console.log("Notifications permission granted.")

    executions$.subscribe({
      next: (executionTrade) => {
        sendFxTradeNotification(executionTrade)
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
        console.error("notifications stream completed!?")
      },
    })
  } catch (_) {
    console.log("Notification permission was not granted.")
  }
}

let quotesReceivedSubscription: Subscription | null = null

export async function registerCreditQuoteNotifications() {
  try {
    await notificationsGranted()
    console.log("Notifications permission granted.")

    quotesReceivedSubscription = lastQuoteReceived$.subscribe({
      next: (quote) => {
        sendCreditQuoteNotification(quote)
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
        console.error("credit quote notifications stream completed!?")
      },
    })
  } catch (_) {
    console.log("Notification permission was not granted.")
  }
}

export function unregisterCreditQuoteNotifications() {
  if (quotesReceivedSubscription) {
    quotesReceivedSubscription.unsubscribe()
  }
}

export async function registerCreditBlotterUpdates() {
  try {
    await notificationsGranted()

    acceptedRfqWithQuote$.subscribe((rfqWithQuote) =>
      sendQuoteAcceptedNotification(rfqWithQuote),
    )
  } catch (e) {
    console.error(e)
  }
}
