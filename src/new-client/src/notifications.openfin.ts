/* eslint-disable no-restricted-globals */
import {
  create,
  addEventListener,
  NotificationActionEvent,
} from "openfin-notifications"

import { ExecutionStatus, ExecutionTrade } from "@/services/executions"
import { executions$ } from "@/services/executions/executions"
import { formatNumber } from "@/utils"
import { onTradeRowHighlight } from "@/App/Trades/TradesState"
import { constructUrl } from "./utils/url"

const sendNotification = (executionTrade: ExecutionTrade) => {
  const notification = {
    ...executionTrade,
    valueDate: executionTrade.valueDate.toString(),
    tradeDate: executionTrade.valueDate.toString(),
  }

  const status =
    notification.status === ExecutionStatus.Done ? "Accepted" : "Rejected"

  const iconUrl = constructUrl(`/static/media/reactive-trader-icon-dark.ico`)

  create({
    title: `Trade ${status}: ID ${notification.tradeId}`,
    body: `${notification.direction} ${
      notification.dealtCurrency
    } ${formatNumber(
      notification.notional,
    )} vs ${notification.currencyPair.substr(3)} @ ${notification.spotRate}`,
    icon: iconUrl,
    customData: { tradeId: notification.tradeId },
    buttons: [
      {
        title: "Highlight trade in blotter",
        iconUrl: iconUrl,
        onClick: { task: "highlight-trade" },
      },
    ],
    category: "Trade Executed",
  })
}

const handleNotificationAction = (event: NotificationActionEvent) => {
  if (event.result["task"] === "highlight-trade") {
    fin.InterApplicationBus.publish(
      "highlight-blotter",
      event.notification.customData,
    )
  }
}

export async function registerNotifications() {
  fin.InterApplicationBus.subscribe(
    { uuid: "*" },
    "highlight-blotter",
    (message: { tradeId: number }) =>
      onTradeRowHighlight(message.tradeId.toString()),
  )

  addEventListener("notification-action", handleNotificationAction)

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
}
