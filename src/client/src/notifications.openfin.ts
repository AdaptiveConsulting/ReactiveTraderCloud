import * as CSS from "csstype"
import {
  addEventListener,
  ContainerTemplateFragment,
  create,
  IndicatorColor,
  NotificationActionEvent,
  TemplateFragment,
  TextTemplateFragment,
} from "openfin-notifications"
import { TemplateCustom } from "openfin-notifications"
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

import { Direction } from "./generated/TradingGateway"
import {
  acceptedRfqWithQuote$,
  lastQuoteReceived$,
  QuoteDetails,
  RfqWithQuote,
} from "./services/credit"
import { constructUrl } from "./utils/url"

const fxIconUrl = constructUrl("/static/media/reactive-trader-fx.svg")
const creditIconUrl = constructUrl("/static/media/reactive-trader-credit.svg")

const TASK_HIGHLIGHT_FX_TRADE = "highlight-fx-trade"
const TASK_HIGHLIGHT_CREDIT_TRADE = "highlight-credit-trade"

// from OF "starter" projects
function createContainer(
  containerType: "column" | "row",
  children: TemplateFragment[],
  style?: CSS.Properties,
): ContainerTemplateFragment {
  return {
    type: "container",
    style: {
      display: "flex",
      flexDirection: containerType,
      ...style,
    },
    children,
  }
}

function createText(
  dataKey: string,
  fontSize = 14,
  style?: CSS.Properties,
): TextTemplateFragment {
  return {
    type: "text",
    dataKey,
    style: {
      fontSize: `${fontSize}px`,
      ...style,
    },
  }
}

// Custom notifications, per
// https://developers.openfin.co/of-docs/docs/customize-notifications#arrangement-of-sections

const sendFxTradeNotification = (executionTrade: ExecutionTrade) => {
  const notification = {
    ...executionTrade,
    valueDate: executionTrade.valueDate.toString(),
    tradeDate: executionTrade.valueDate.toString(),
  }

  const status =
    notification.status === ExecutionStatus.Done ? "Accepted" : "Rejected"
  const baseCurrency = notification.currencyPair.substring(0, 3)
  const quoteCurrency = notification.currencyPair.substring(3)

  const notificationOptions: TemplateCustom = {
    icon: fxIconUrl,
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
            layout: createContainer(
              "row",
              [
                createText("messageTradeDirection", 12, {
                  fontWeight: "bold",
                  backgroundColor:
                    notification.direction === Direction.Buy ? "green" : "red",
                  borderRadius: "10px",
                  padding: "0 5px",
                }),
                createText("messageTradeDetails", 12),
              ],
              {
                // some mininal styling for the container, to keep the "pill" and message apart
                alignItems: "baseline",
                gap: "4px",
              },
            ),
          },
        ],
      },
      indicator: {
        align: "left",
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
        iconUrl: fxIconUrl,
        onClick: { task: TASK_HIGHLIGHT_FX_TRADE },
      },
    ],
    templateData: {
      messageTradeDirection: notification.direction.toUpperCase(),
      messageTradeDetails: `${baseCurrency} ${formatNumber(
        notification.notional,
      )} vs ${quoteCurrency} @ ${notification.spotRate}`,
    },
  }

  create(notificationOptions)
}

const sendQuoteAcceptedNotification = ({ rfq, quote }: RfqWithQuote) => {
  const dealer = rfq.dealers.find((dealer) => dealer.id === quote.dealerId)
  const title = `Quote Accepted: RFQ ID ${quote.rfqId} from ${dealer?.name}`

  const notificationOptions: TemplateCustom = {
    icon: creditIconUrl,
    template: "custom",
    category: "Trade Executed",
    title,
    customData: { tradeId: rfq.id },
    indicator: { text: "Accepted" },
    templateOptions: {
      body: {
        compositions: [
          {
            minTemplateAPIVersion: "1",
            layout: createContainer(
              "row",
              [
                createText("messageTradeDirection", 12, {
                  fontWeight: "bold",
                  backgroundColor:
                    rfq.direction === Direction.Buy ? "green" : "red",
                  borderRadius: "10px",
                  padding: "0 5px",
                }),
                createText("messageTradeDetails", 12),
              ],
              {
                alignItems: "baseline",
                gap: "4px",
              },
            ),
          },
        ],
      },
      indicator: {
        align: "left",
        color: IndicatorColor.GREEN,
      },
      buttons: {
        align: "right",
      },
    },
    buttons: [
      {
        title: "Highlight trade in blotter",
        iconUrl: creditIconUrl,
        onClick: { task: TASK_HIGHLIGHT_CREDIT_TRADE },
      },
    ],
    templateData: {
      messageTradeDirection: rfq.direction.toUpperCase(),
      messageTradeDetails: `${rfq.quantity} ${rfq.instrument?.name} @ ${quote?.price}`,
    },
  }

  create(notificationOptions)
}

const sendCreditQuoteNotification = (quote: QuoteDetails) => {
  const title = `Quote Received: RFQ ID ${quote.rfqId} from ${quote.dealer?.name}`

  const notificationOptions: TemplateCustom = {
    icon: creditIconUrl,
    template: "custom",
    category: "Quote Received",
    title,
    indicator: { text: "quote" }, // TODO change to "new quote" when we have a View RFQ button
    templateOptions: {
      body: {
        compositions: [
          {
            minTemplateAPIVersion: "1",
            layout: createContainer(
              "row",
              [
                createText("messageTradeDirection", 12, {
                  fontWeight: "bold",
                  backgroundColor:
                    quote.direction === Direction.Buy ? "green" : "red",
                  borderRadius: "10px",
                  padding: "0 5px",
                }),
                createText("messageTradeDetails", 12),
              ],
              {
                alignItems: "baseline",
                gap: "4px",
              },
            ),
          },
        ],
      },
      indicator: {
        align: "left",
        color: IndicatorColor.GRAY,
      },
    },
    templateData: {
      messageTradeDirection: quote.direction.toUpperCase(),
      messageTradeDetails: `${quote.instrument?.name} ${formatNumber(
        quote.quantity,
      )} @ $${formatNumber(quote.price)}`,
    },
  }

  create(notificationOptions)
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
