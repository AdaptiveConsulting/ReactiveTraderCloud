/* eslint-disable no-restricted-globals */
import {
  addEventListener,
  create,
  IndicatorColor,
  NotificationActionEvent,
} from "openfin-notifications"
import { Subscription } from "rxjs"

import {
  setCreditTradeRowHighlight,
  setFxTradeRowHighlight,
} from "@/App/Trades/TradesState"
import {
  executions$,
  ExecutionStatus,
  ExecutionTrade,
} from "@/services/executions"
import { formatNumber } from "@/utils"

import {
  acceptedRfqWithQuote$,
  lastQuoteReceived$,
  QuoteDetails,
  RfqWithQuote,
} from "./services/credit"
import { constructUrl } from "./utils/url"

const icon = constructUrl("/static/media/reactive-trader-icon-dark.ico")

const TASK_HIGHLIGHT_FX_TRADE = "highlight-fx-trade"
const TASK_HIGHLIGHT_CREDIT_TRADE = "highlight-credit-trade"

const TASK_HIGHLIGHT_CREDIT_TRADE = "highlight-credit-trade"

const sendFxTradeNotification = (executionTrade: ExecutionTrade) => {
  const notification = {
    ...executionTrade,
    valueDate: executionTrade.valueDate.toString(),
    tradeDate: executionTrade.valueDate.toString(),
  }

  const status =
    notification.status === ExecutionStatus.Done ? "Accepted" : "Rejected"

  const notif = {
    title: `Trade ${status}: ID ${notification.tradeId}`,
    buttons: [
      {
        title: "Highlight trade in blotter",
        iconUrl: icon,
        onClick: { task: TASK_HIGHLIGHT_FX_TRADE },
      },
    ],
    body: `${notification.direction} ${
      notification.dealtCurrency
    } ${formatNumber(
      notification.notional,
    )} vs ${notification.currencyPair.substring(3)} @ ${notification.spotRate}`,
    icon,
    customData: { tradeId: notification.tradeId },
    category: "Trade Executed",
    indicator: {
      color: status === "Accepted" ? IndicatorColor.GREEN : IndicatorColor.RED,
      text: status,
    },
  }

  create({
    icon,
    template: "custom",
    category: "Trade Executed",
    title: `Trade ${status}: ID ${notification.tradeId}`,
    customData: { tradeId: notification.tradeId },
    indicator: { text: status },
    templateOptions: {
      body: {
        compositions: [
          {
            minTemplateAPIVersion: "1",
            layout: {
              type: "text",
              dataKey: "message",
            },
          },
        ],
      },
      indicator: {
        align: "center", //left, right, center
        color:
          status === "Accepted" ? IndicatorColor.GREEN : IndicatorColor.RED,
      },
      buttons: {
        align: "right",
      },
    },
    buttons: [
      {
        title: "Highlight trade in blotter",
        iconUrl: icon,
        onClick: { task: TASK_HIGHLIGHT_FX_TRADE },
      },
    ],
    templateData: {
      message: `${notification.direction} ${
        notification.dealtCurrency
      } ${formatNumber(
        notification.notional,
      )} vs ${notification.currencyPair.substring(3)} @ ${
        notification.spotRate
      }`,
    },
  })
}

const sendQuoteAcceptedNotification = ({ rfq, quote }: RfqWithQuote) => {
  const notification = {
    ...rfq,
  }

  create({
    title: `Quote Accepted: ID ${notification.id}`,
    body: `${notification.direction} ${notification.quantity} ${notification.instrument?.name} @ ${quote?.price}`,
    icon,
    customData: { tradeId: notification.id },
    buttons: [
      {
        title: "Highlight trade in blotter",
        iconUrl: icon,
        onClick: { task: TASK_HIGHLIGHT_CREDIT_TRADE },
      },
    ],
    category: "Trade Executed",
  })
}

const sendCreditQuoteNotification = (quote: QuoteDetails) => {
  const notification = {
    ...quote,
  }

  const title = `Quote Received: RFQ ID ${quote.rfqId} from ${quote.dealer?.name}`
  const body = `${quote.direction} ${quote.instrument?.name} ${formatNumber(
    quote.quantity,
  )} @ $${formatNumber(quote.price)}`

  create({
    title,
    body,
    icon,
    category: "Quote Received",
    indicator: {
      text: `${quote.dealer?.name}`,
      color:
        `${quote.direction}` === "Buy"
          ? IndicatorColor.BLUE
          : IndicatorColor.PURPLE,
    },
  })
}

const TOPIC_HIGHLIGHT_FX_BLOTTER = "highlight-fx-blotter"
const handleFxTradeNotificationAction = (event: NotificationActionEvent) => {
  if (event.result["task"] === TASK_HIGHLIGHT_FX_TRADE) {
    fin.InterApplicationBus.publish(
      TOPIC_HIGHLIGHT_FX_BLOTTER,
      event.notification.customData,
    )
  }
}

export async function registerFxNotifications() {
  fin.InterApplicationBus.subscribe(
    { uuid: "*" },
    TOPIC_HIGHLIGHT_FX_BLOTTER,
    (message: { tradeId: number }) => setFxTradeRowHighlight(message.tradeId),
  )

  addEventListener("notification-action", handleFxTradeNotificationAction)

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

let quotesReceivedSubscription: Subscription | null = null

export async function registerCreditQuoteNotifications() {
  quotesReceivedSubscription = lastQuoteReceived$.subscribe({
    next: (quote) => {
      sendCreditQuoteNotification(quote)
    },
    error: (e) => {
      console.error(e)
    },
    complete: () => {
      console.error("credit quote notifications stream completed!?")
    },
  })
}

export function unregisterCreditQuoteNotifications() {
  if (quotesReceivedSubscription) {
    quotesReceivedSubscription.unsubscribe()
  }
}

export const TOPIC_HIGHLIGHT_CREDIT_BLOTTER = "highlight-credit-blotter"

const handleCreditTradeNotification = (event: NotificationActionEvent) => {
  if (event.result["task"] === TASK_HIGHLIGHT_CREDIT_TRADE) {
    fin.InterApplicationBus.publish(
      TOPIC_HIGHLIGHT_CREDIT_BLOTTER,
      event.notification.customData,
    )
  }
}

export async function registerCreditBlotterUpdates() {
  fin.InterApplicationBus.subscribe(
    { uuid: "*" },
    TOPIC_HIGHLIGHT_CREDIT_BLOTTER,
    (message: { tradeId: number }) => {
      setCreditTradeRowHighlight(message.tradeId)
    },
  )

  addEventListener("notification-action", handleCreditTradeNotification)

  acceptedRfqWithQuote$.subscribe((rfq) => {
    sendQuoteAcceptedNotification(rfq)
  })
}
