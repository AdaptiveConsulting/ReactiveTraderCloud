import { Subscription } from "rxjs"

import { ExecutionTrade } from "@/services/executions"
import { executions$ } from "@/services/executions/executions"

import { processFxExecution } from "./notificationsUtils"

function sendFxTradeNotification(executionTrade: ExecutionTrade) {
  const { title, tradeDetails: tradeCurrencyDetails } =
    processFxExecution(executionTrade)
  const body = `${executionTrade.direction} ${tradeCurrencyDetails}`

  const notification = new window.FSBL.Clients.NotificationClient.Notification()
  notification.title = title
  notification.details = body
  notification.type = "trade"

  window.FSBL.Clients.NotificationClient.notify([notification])
}

let executionSubscription: Subscription | null = null

export function registerFxTradeNotifications() {
  executionSubscription = executions$.subscribe({
    next: (executionTrade) => {
      sendFxTradeNotification(executionTrade)
    },
    error: (e) => {
      console.error(e)
    },
    complete: () => {
      console.error("FX trade notifications stream completed!?")
    },
  })
}

export function unregisterFxTradeNotifications() {
  if (executionSubscription) {
    executionSubscription.unsubscribe()
  }
}

//
// TODO (5580) implement these for Finsemble when adding in Credit apps/views
//

export function registerCreditRfqCreatedNotifications() {
  // no-op
}

export function unregisterCreditRfqCreatedNotifications() {
  // no-op
}

export function registerCreditQuoteReceivedNotifications() {
  // no-op
}

export function unregisterCreditQuoteReceivedNotifications() {
  // no-op
}

export function registerCreditQuoteAcceptedNotifications() {
  // no-op
}

export function unregisterCreditQuoteAcceptedNotifications() {
  // no-op
}
