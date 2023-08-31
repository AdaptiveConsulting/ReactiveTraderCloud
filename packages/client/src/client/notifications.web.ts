import { Subscription } from "rxjs"

import {
  acceptedRfqWithQuote$,
  lastQuoteReceived$,
  PricedQuoteDetails,
  QuoteDetails,
  RfqWithPricedQuote,
} from "@/services/credit"
import { executions$, ExecutionTrade } from "@/services/executions"

import {
  processCreditAccepted,
  processCreditQuote,
  processFxExecution,
} from "./notificationsUtils"
import { constructUrl } from "./utils/url"

const fxIconUrl = constructUrl("/static/media/reactive-trader-fx.svg")
const creditIconUrl = constructUrl("/static/media/reactive-trader-credit.svg")

const sendFxTradeNotification = (trade: ExecutionTrade) => {
  const { title, tradeDetails: tradeCurrencyDetails } =
    processFxExecution(trade)

  const options: NotificationOptions = {
    body: `${trade.direction} ${tradeCurrencyDetails}`,
    icon: fxIconUrl,
    dir: "ltr",
  }

  new Notification(title, options)
}

const sendQuoteAcceptedNotification = ({ rfq, quote }: RfqWithPricedQuote) => {
  const { title, tradeDetails } = processCreditAccepted(rfq, quote)

  const options: NotificationOptions = {
    body: `${rfq.direction} ${tradeDetails}`,
    icon: creditIconUrl,
    dir: "ltr",
  }

  new Notification(title, options)
}

const sendCreditQuoteNotification = (quote: PricedQuoteDetails) => {
  const { title, tradeDetails } = processCreditQuote(quote)

  const options: NotificationOptions = {
    body: `${quote.direction} ${tradeDetails}`,
    icon: creditIconUrl,
    dir: "ltr",
  }

  new Notification(title, options)
}

const notificationsGranted = () =>
  new Promise<void>((resolve, reject) => {
    if (!("Notification" in window)) reject()

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "denied") {
          reject()
        } else {
          resolve()
        }
      })
    } else {
      if (Notification.permission === "granted") {
        resolve()
      } else {
        reject()
      }
    }
  })

export async function registerFxNotifications() {
  try {
    await notificationsGranted()

    // send trade executed for this tab only (driven from executeTrade ACK)
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

    // send quote alerts for every live tab connected to BE (driven from rfq update feed)
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

export async function registerCreditAcceptedNotifications() {
  try {
    await notificationsGranted()

    // send accepted quote for this tab only (driven from acceptQuote ACK)
    acceptedRfqWithQuote$.subscribe((rfqWithQuote) =>
      sendQuoteAcceptedNotification(rfqWithQuote),
    )
  } catch (e) {
    console.error(e)
  }
}
