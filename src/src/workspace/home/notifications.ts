import { create } from "openfin-notifications"
import { filter } from "rxjs"

import { ExecutionStatus, ExecutionTrade } from "@/services/executions"
import { BASE_URL } from "@/workspace/consts"
import { executionResponse$ } from "@/workspace/services/executions"

const sendFxTradeNotification = (trade: ExecutionTrade) => {
  const notification = {
    ...trade,
    valueDate: trade.valueDate.toString(),
    tradeDate: trade.valueDate.toString(),
  }

  const status =
    notification.status === ExecutionStatus.Done ? "Accepted" : "Rejected"

  const iconUrl = `${BASE_URL}/images/icons/reactive-trader.png`

  create({
    title: `Trade ${status}: ID ${notification.tradeId}`,
    body: `${notification.direction} ${notification.dealtCurrency} ${
      notification.notional
    } vs ${notification.currencyPair.substr(3)} @ ${notification.spotRate}`,
    icon: iconUrl,
    customData: { tradeId: notification.tradeId },
    buttons: [],
    category: "Trade Executed",
  })
}

export async function registerFxNotifications() {
  executionResponse$
    .pipe(
      filter(
        (response) =>
          response.status === ExecutionStatus.Done ||
          response.status === ExecutionStatus.Rejected,
      ),
    )
    .subscribe((executionResponse) => {
      sendFxTradeNotification(executionResponse as ExecutionTrade)
    })
}
