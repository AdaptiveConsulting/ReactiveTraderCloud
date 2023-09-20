import { Subscription } from "rxjs"

import {
  acceptedRfqWithQuote$,
  ConfirmCreatedCreditRfq,
  createdCreditConfirmation$,
  lastQuoteReceived$,
  PricedQuoteDetails,
  RfqWithPricedQuote,
} from "@/services/credit"
import { executions$, ExecutionTrade } from "@/services/executions"

import {
  processCreditQuote,
  processCreditRfqAccepted,
  processCreditRfqCreated,
  processFxExecution,
} from "./notificationsUtils"
import { constructUrl } from "./utils/constructUrl"

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
  const { title, tradeDetails } = processCreditRfqAccepted(rfq, quote)

  const options: NotificationOptions = {
    body: `${rfq.direction} ${tradeDetails}`,
    icon: creditIconUrl,
    dir: "ltr",
  }

  new Notification(title, options)
}

const sendCreditCreatedNotification = (rfqCreate: ConfirmCreatedCreditRfq) => {
  const { title, rfqDetails } = processCreditRfqCreated(rfqCreate)
  const options: NotificationOptions = {
    body: `You have sent a ${rfqCreate.request.direction} ${rfqDetails}`,
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
let executionSubscription: Subscription | null = null

export async function registerFxNotifications() {
  try {
    await notificationsGranted()

    // send trade executed for this tab only (driven from executeTrade ACK)
    executionSubscription = executions$.subscribe({
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

export function unregisterFxNotifications() {
  if (executionSubscription) {
    executionSubscription.unsubscribe()
  }
}

let quotesReceivedSubscription: Subscription | null = null
let acceptedRfqWithQuoteSubscription: Subscription | null = null
let createdCreditSubscription: Subscription | null = null

export async function registerCreditNotifications() {
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

    // send accepted quote for this tab only (driven from acceptQuote ACK)
    acceptedRfqWithQuoteSubscription = acceptedRfqWithQuote$.subscribe({
      next: (rfqWithQuote) => {
        sendQuoteAcceptedNotification(rfqWithQuote)
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
        console.error("accepted Rfq notifications stream completed!?")
      },
    })
  } catch (e) {
    console.error(e)
  }
}

export function registerCreatedCreditNotification() {
  // send created rfq
  createdCreditSubscription = createdCreditConfirmation$.subscribe({
    next: (createdRFQRequest) => {
      sendCreditCreatedNotification(createdRFQRequest)
    },
    error: (e) => {
      console.error(e)
    },
    complete: () => {
      console.error("Created credit notifications stream completed!?")
    },
  })
}

export function unregisterCreatedCreditNotification() {
  if (createdCreditSubscription) {
    createdCreditSubscription.unsubscribe()
  }
}

export function unregisterCreditNotifications() {
  if (quotesReceivedSubscription) {
    quotesReceivedSubscription.unsubscribe()
  }

  if (acceptedRfqWithQuoteSubscription) {
    acceptedRfqWithQuoteSubscription.unsubscribe()
  }
}
