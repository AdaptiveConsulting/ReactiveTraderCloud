import { create } from "openfin-notifications"
import { BASE_URL } from "@/workspace/consts"
import { executionResponse$ } from "@/workspace/services/executions"
import { ExecutionResponse, TradeStatus } from "@/generated/TradingGateway"

const sendFxTradeNotification = (executionResponse: ExecutionResponse) => {
  const notification = {
    ...executionResponse.trade,
    valueDate: executionResponse.trade.valueDate.toString(),
    tradeDate: executionResponse.trade.valueDate.toString(),
  }

  const status =
    notification.status === TradeStatus.Done ? "Accepted" : "Rejected"

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
  executionResponse$.subscribe((executionResponse) => {
    sendFxTradeNotification(executionResponse)
  })
}
