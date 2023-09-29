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
  processCreditQuoteReceived,
  processCreditRfqCreatedConfirmation,
  processCreditRfqWithAcceptedQuote,
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

const sendCreditRfqCreatedNotification = (
  rfqCreate: ConfirmCreatedCreditRfq,
) => {
  const { title, rfqDetails } = processCreditRfqCreatedConfirmation(rfqCreate)
  const options: NotificationOptions = {
    body: `You have sent a ${rfqCreate.request.direction} ${rfqDetails}`,
    icon: creditIconUrl,
    dir: "ltr",
  }

  new Notification(title, options)
}

const sendCreditQuoteReceivedNotification = (quote: PricedQuoteDetails) => {
  const { title, quoteDetails } = processCreditQuoteReceived(quote)

  const options: NotificationOptions = {
    body: `${quote.direction} ${quoteDetails}`,
    icon: creditIconUrl,
    dir: "ltr",
  }

  new Notification(title, options)
}

const sendCreditQuoteAcceptedNotification = ({
  rfq,
  quote,
}: RfqWithPricedQuote) => {
  const { title, tradeDetails } = processCreditRfqWithAcceptedQuote(rfq, quote)

  const options: NotificationOptions = {
    body: `${rfq.direction} ${tradeDetails}`,
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

export async function registerFxTradeNotifications() {
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
        console.error("FX notifications execution stream completed!?")
      },
    })
  } catch (_) {
    console.log("Notification permission was not granted.")
  }
}

export function unregisterFxTradeNotifications() {
  if (executionSubscription) {
    executionSubscription.unsubscribe()
  }
}

let creditRfqCreatedSubscription: Subscription | null = null

export function registerCreditRfqCreatedNotifications() {
  // send rfq created alerts for this tab only (driven from credit createRfq ACK)
  creditRfqCreatedSubscription = createdCreditConfirmation$.subscribe({
    next: (createdRFQRequest) => {
      sendCreditRfqCreatedNotification(createdRFQRequest)
    },
    error: (e) => {
      console.error(e)
    },
    complete: () => {
      console.error("Credit notifications RFQ created stream completed!?")
    },
  })
}

export function unregisterCreditRfqCreatedNotifications() {
  if (creditRfqCreatedSubscription) {
    creditRfqCreatedSubscription.unsubscribe()
  }
}

let creditQuoteReceivedSubscription: Subscription | null = null

export async function registerCreditQuoteReceivedNotifications() {
  try {
    await notificationsGranted()

    // send quote alerts for every live tab connected to BE (driven from rfq update feed)
    creditQuoteReceivedSubscription = lastQuoteReceived$.subscribe({
      next: (quote) => {
        sendCreditQuoteReceivedNotification(quote)
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
        console.error("credit quote received notifications stream completed!?")
      },
    })
  } catch (e) {
    console.error(e)
  }
}

export function unregisterCreditQuoteReceivedNotifications() {
  if (creditQuoteReceivedSubscription) {
    creditQuoteReceivedSubscription.unsubscribe()
  }
}

let creditQuoteAcceptedSubscription: Subscription | null = null

export async function registerCreditQuoteAcceptedNotifications() {
  try {
    await notificationsGranted()

    // send accepted quote alerts for this tab only (driven from credit accept ACK)
    creditQuoteAcceptedSubscription = acceptedRfqWithQuote$.subscribe({
      next: (rfqWithQuote) => {
        sendCreditQuoteAcceptedNotification(rfqWithQuote)
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
        console.error("credit quote accepted notifications stream completed!?")
      },
    })
  } catch (e) {
    console.error(e)
  }
}

export function unregisterCreditQuoteAcceptedNotifications() {
  if (creditQuoteAcceptedSubscription) {
    creditQuoteAcceptedSubscription.unsubscribe()
  }
}
