import { CurrencyPair } from "@/services/currencyPairs"
import { TradeStatus } from "@/services/trades"
import { ExecutionTrade } from "@/services/executions"

interface TradeNotification {
  tradeId: number
  symbol: string
  notional: string
  dealtCurrency: string
  termsCurrency?: string
  direction: any
  spotRate: number
  tradeDate: string
  valueDate: string
  status: any
}

let registration: ServiceWorkerRegistration
navigator.serviceWorker &&
  navigator.serviceWorker.ready.then((reg) => {
    registration = reg
  })

export const formatTradeNotification: (
  trade: ExecutionTrade,
  currencyPair: CurrencyPair,
) => TradeNotification = (
  trade: ExecutionTrade,
  currencyPair: CurrencyPair,
) => ({
  tradeId: trade.tradeId,
  symbol: trade.currencyPair,
  notional: trade.notional.toPrecision(2),
  dealtCurrency: currencyPair.base,
  termsCurrency: currencyPair.terms,
  direction: trade.direction,
  spotRate: trade.spotRate,
  tradeDate: trade.valueDate.toString(),
  valueDate: trade.valueDate,
  status: trade.status,
})

export const getTradeNotificationContents = (
  tradeNotification: TradeNotification,
): { title: string; body: string } => {
  const status =
    tradeNotification.status === TradeStatus.Done ? "Accepted" : "Rejected"
  const title = `Trade ${status}: ID ${tradeNotification.tradeId}`
  const body = `${tradeNotification.direction} ${tradeNotification.dealtCurrency} ${tradeNotification.notional} vs ${tradeNotification.termsCurrency} @ ${tradeNotification.spotRate}`
  return {
    title,
    body,
  }
}

export const sendNotification = (tradeNotification: TradeNotification) => {
  const { title, body } = getTradeNotificationContents(tradeNotification)
  const icon =
    navigator.userAgent.indexOf("Chrome") !== -1 &&
    navigator.userAgent.indexOf("Win") !== -1
      ? "./static/media/reactive-trader-icon-no-bkgd-256x256.png"
      : "./static/media/reactive-trader-icon-dark-256x256.png" // MacOS & Firefox notifications have white backgrounds, so use dark backgrounded icon

  const options: NotificationOptions = {
    body: body,
    icon: icon,
    dir: "ltr",
    data: tradeNotification,
    tag: "trade",
  }

  if (registration) {
    registration.showNotification(title, options)
  } else {
    delete options.actions
    const notification = new Notification(title, options)
  }
}
