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

// NOTE: All the guard code complication below is due to:
//       a) the delay of the notificationsGranted promise - in development mode effects, unreg happens before reg
//       b) other calls of the same registration in the same context causes duplicate subs

let executionSubscription: Subscription | null = null

export async function registerFxTradeNotifications() {
  try {
    await notificationsGranted()

    if (executionSubscription) {
      return
    }

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
  } catch {
    console.log("Notification permission was not granted.")
  }
}

export function unregisterFxTradeNotifications() {
  if (executionSubscription) {
    executionSubscription.unsubscribe()
    executionSubscription = null
  }
}

let creditRfqCreatedSubscription: Subscription | null = null

export async function registerCreditRfqCreatedNotifications() {
  try {
    await notificationsGranted()

    if (creditRfqCreatedSubscription) {
      return
    }

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
  } catch (e) {
    console.error(e)
  }
}

export function unregisterCreditRfqCreatedNotifications() {
  if (creditRfqCreatedSubscription) {
    creditRfqCreatedSubscription.unsubscribe()
    creditRfqCreatedSubscription = null
  }
}

let creditQuoteReceivedSubscription: Subscription | null = null

export async function registerCreditQuoteReceivedNotifications() {
  try {
    await notificationsGranted()

    if (creditQuoteReceivedSubscription) {
      return
    }

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
    creditQuoteReceivedSubscription = null
  }
}

let creditQuoteAcceptedSubscription: Subscription | null = null

export async function registerCreditQuoteAcceptedNotifications() {
  try {
    await notificationsGranted()

    if (creditQuoteAcceptedSubscription) {
      return
    }

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
    creditQuoteAcceptedSubscription = null
  }
}
