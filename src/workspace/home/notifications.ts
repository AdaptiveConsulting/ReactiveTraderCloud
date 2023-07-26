import { create } from "openfin-notifications"
import { filter } from "rxjs"
import {
  executions$,
  ExecutionStatus,
  ExecutionTrade,
} from "services/executions"
import { BASE_URL } from "workspace/consts"

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
  executions$.subscribe((executionResponse) => {
    sendFxTradeNotification(executionResponse as ExecutionTrade)
  })
}
