import { ExecutionTrade } from "@/services/executions"
import { executions$ } from "@/services/executions/executions"

import { processFxExecution } from "./notificationsUtils"

export function sendFxTradeNotification(executionTrade: ExecutionTrade) {
  const { title, tradeDetails: tradeCurrencyDetails } =
    processFxExecution(executionTrade)
  const body = `${executionTrade.direction} ${tradeCurrencyDetails}`

  const notification = new window.FSBL.Clients.NotificationClient.Notification()
  notification.title = title
  notification.details = body
  notification.type = "trade"

  window.FSBL.Clients.NotificationClient.notify([notification])
}

export function registerFxNotifications() {
  executions$.subscribe({
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

// TODO (4823) implement these for Finsemble when upgrading

export function registerCreditAcceptedNotifications() {
  // no-op
}

export function registerCreditQuoteNotifications() {
  // no-op
}

export function unregisterCreditQuoteNotifications() {
  // no-op
}
