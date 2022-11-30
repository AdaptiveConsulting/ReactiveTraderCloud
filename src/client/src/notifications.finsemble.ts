import { ExecutionStatus, ExecutionTrade } from "@/services/executions"
import { executions$ } from "@/services/executions/executions"

export function sendFxTradeNotification(executionTrade: ExecutionTrade) {
  const status =
    executionTrade.status === ExecutionStatus.Done ? "Accepted" : "Rejected"
  const title = `Trade ${status}: ID ${executionTrade.tradeId}`
  const body = `${executionTrade.direction} ${executionTrade.dealtCurrency} ${
    executionTrade.notional
  } vs ${executionTrade.currencyPair.substr(3)} @ ${executionTrade.spotRate}`

  const notification = new window.FSBL.Clients.NotificationClient.Notification()
  notification.title = title
  notification.details = body
  notification.type = "trade"

  window.FSBL.Clients.NotificationClient.notify([notification])
}

export async function registerFxNotifications() {
  executions$.subscribe(
    (executionTrade) => {
      sendFxTradeNotification(executionTrade)
    },
    (e) => {
      console.error(e)
    },
    () => {
      console.error("notifications stream completed!?")
    },
  )
}

export function registerCreditBlotterUpdates() {
  // no-op
}
