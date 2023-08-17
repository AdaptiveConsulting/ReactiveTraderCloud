import {
  setCreditTradeRowHighlight,
  setFxTradeRowHighlight,
} from "client/App/Trades/TradesState"
import * as CSS from "csstype"
import { Direction } from "generated/TradingGateway"
import {
  addEventListener,
  ContainerTemplateFragment,
  create,
  CustomTemplateOptions,
  IndicatorColor,
  NotificationActionEvent,
  TemplateCustom,
  TemplateFragment,
  TextTemplateFragment,
} from "openfin-notifications"
import { Subscription } from "rxjs"
import {
  acceptedRfqWithQuote$,
  lastQuoteReceived$,
  QuoteDetails,
  RfqWithQuote,
} from "services/credit"
import { executions$, ExecutionTrade } from "services/executions"

import { setCreditRfqCardHighlight } from "./App/Credit/CreditRfqs/CreditRfqCards"
import {
  processCreditAccepted,
  processCreditQuote,
  processFxExecution,
} from "./notificationsUtils"
import { constructUrl } from "./utils/url"

const fxIconUrl = constructUrl("/static/media/reactive-trader-fx.svg")
const creditIconUrl = constructUrl("/static/media/reactive-trader-credit.svg")

export const TASK_HIGHLIGHT_FX_TRADE = "highlight-fx-trade"
export const TASK_HIGHLIGHT_CREDIT_TRADE = "highlight-credit-trade"
export const TASK_HIGHLIGHT_CREDIT_RFQ = "highlight-credit-rfq"

// from OF "starter" projects
const createContainer = (
  containerType: "column" | "row",
  children: TemplateFragment[],
  style?: CSS.Properties,
): ContainerTemplateFragment => ({
  type: "container",
  style: {
    display: "flex",
    flexDirection: containerType,
    ...style,
  },
  children,
})

const createText = (
  dataKey: string,
  fontSize = 14,
  style?: CSS.Properties,
): TextTemplateFragment => ({
  type: "text",
  dataKey,
  style: {
    fontSize: `${fontSize}px`,
    ...style,
  },
})

// Custom notifications, per
// https://developers.openfin.co/of-docs/docs/customize-notifications#arrangement-of-sections
// we are not using it "correctly", as the templateOptions should not be repeated every time
// (it is supposed to be a 'template' after all) but styling requires conditionals atm and
// there is no way (so far) of doing that with the primitive "dataKey" approach using templateData

const basicNotificationContainerStyles: CSS.Properties = {
  alignItems: "baseline",
  gap: "4px",
}

const createNotificationTemplate = (
  direction: Direction,
): CustomTemplateOptions => ({
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
                direction === Direction.Buy
                  ? "rgb(45, 149, 255)"
                  : "rgb(255, 39, 75)",
              borderRadius: "10px",
              padding: "0 5px",
            }),
            createText("messageTradeDetails", 12),
          ],
          basicNotificationContainerStyles,
        ),
      },
    ],
  },
  indicator: {
    align: "left",
  },
})

const sendFxTradeNotification = (trade: ExecutionTrade) => {
  const { status, title, tradeDetails } = processFxExecution(trade)

  const notificationOptions: TemplateCustom = {
    template: "custom",
    templateOptions: createNotificationTemplate(trade.direction),
    templateData: {
      messageTradeDirection: trade.direction.toUpperCase(),
      messageTradeDetails: tradeDetails,
    },
    // non-template stuff below
    icon: fxIconUrl,
    category: "Trade Executed",
    title,
    indicator: {
      text: status,
      color: status === "Accepted" ? IndicatorColor.GREEN : IndicatorColor.RED,
    },
    buttons: [
      {
        title: "Highlight trade in blotter",
        iconUrl: fxIconUrl,
        onClick: {
          task: TASK_HIGHLIGHT_FX_TRADE,
          payload: {
            tradeId: trade.tradeId,
          },
        },
      },
    ],
  }

  create(notificationOptions)
}

const sendQuoteAcceptedNotification = ({ rfq, quote }: RfqWithQuote) => {
  const { title, tradeDetails } = processCreditAccepted(rfq, quote)

  const notificationOptions: TemplateCustom = {
    template: "custom",
    templateOptions: createNotificationTemplate(rfq.direction),
    templateData: {
      messageTradeDirection: rfq.direction.toUpperCase(),
      messageTradeDetails: tradeDetails,
    },
    // non-template stuff below
    icon: creditIconUrl,
    category: "Trade Executed",
    title,
    indicator: {
      text: "accepted",
      color: IndicatorColor.GREEN,
    },
    buttons: [
      {
        title: "Highlight trade in blotter",
        iconUrl: creditIconUrl,
        onClick: {
          task: TASK_HIGHLIGHT_CREDIT_TRADE,
          payload: {
            tradeId: rfq.id,
          },
        },
      },
    ],
  }

  create(notificationOptions)
}

const sendCreditQuoteNotification = (quote: QuoteDetails) => {
  const { title, tradeDetails } = processCreditQuote(quote)

  const notificationOptions: TemplateCustom = {
    template: "custom",
    templateOptions: createNotificationTemplate(quote.direction),
    templateData: {
      messageTradeDirection: quote.direction.toUpperCase(),
      messageTradeDetails: tradeDetails,
    },
    // non-template stuff below
    icon: creditIconUrl,
    category: "Quote Received",
    title,
    indicator: {
      text: "new quote",
      color: IndicatorColor.GRAY,
    },
    buttons: [
      {
        title: "View RFQ",
        iconUrl: creditIconUrl,
        onClick: {
          task: TASK_HIGHLIGHT_CREDIT_RFQ,
          payload: {
            rfqId: quote.rfqId,
          },
        },
      },
    ],
  }

  create(notificationOptions)
}

const TOPIC_HIGHLIGHT_FX_BLOTTER = "highlight-fx-blotter"
export const TOPIC_HIGHLIGHT_CREDIT_RFQ = "highlight-credit-rfq"
export const TOPIC_HIGHLIGHT_CREDIT_BLOTTER = "highlight-credit-blotter"

export const handleHighlightFxBlotterAction = (
  event: NotificationActionEvent,
) => {
  if (event.result.task === TASK_HIGHLIGHT_FX_TRADE) {
    fin.InterApplicationBus.publish(
      TOPIC_HIGHLIGHT_FX_BLOTTER,
      event.result.payload,
    )
  }
}

let quotesReceivedSubscription: Subscription | null = null

const handleHighlightCreditBlotterAction = (event: NotificationActionEvent) => {
  if (event.result.task === TASK_HIGHLIGHT_CREDIT_TRADE) {
    fin.InterApplicationBus.publish(
      TOPIC_HIGHLIGHT_CREDIT_BLOTTER,
      event.result.payload,
    )
  }
}

export const handleHighlightRfqAction = (event: NotificationActionEvent) => {
  if (event.result.task === TASK_HIGHLIGHT_CREDIT_RFQ) {
    fin.InterApplicationBus.publish(
      TOPIC_HIGHLIGHT_CREDIT_RFQ,
      event.result.payload,
    )
  }
}

export type NotificationActionHandler = (event: NotificationActionEvent) => void

let areFxNotificationsRegistered = false
export const registerFxNotifications = (
  handler?: NotificationActionHandler,
) => {
  if (!areFxNotificationsRegistered) {
    areFxNotificationsRegistered = true

    fin.InterApplicationBus.subscribe(
      { uuid: "*" },
      TOPIC_HIGHLIGHT_FX_BLOTTER,
      (message: { tradeId: number }) => setFxTradeRowHighlight(message.tradeId),
    )

    addEventListener(
      "notification-action",
      handler || handleHighlightFxBlotterAction,
    )

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
}

let areCreditQuoteNotificatiosRegistered = false
export const registerCreditQuoteNotifications = (
  handler?: NotificationActionHandler,
) => {
  if (!areCreditAcceptedNotificationsRegistered) {
    areCreditQuoteNotificatiosRegistered = true

    fin.InterApplicationBus.subscribe(
      { uuid: "*" },
      TOPIC_HIGHLIGHT_CREDIT_RFQ,
      (message: { rfqId: number }) => {
        setCreditRfqCardHighlight(message.rfqId)
      },
    )

    addEventListener("notification-action", handler || handleHighlightRfqAction)

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
}

let areCreditAcceptedNotificationsRegistered = false
export const registerCreditAcceptedNotifications = (
  handler?: NotificationActionHandler,
) => {
  if (!areCreditAcceptedNotificationsRegistered) {
    areCreditAcceptedNotificationsRegistered = true

    fin.InterApplicationBus.subscribe(
      { uuid: "*" },
      TOPIC_HIGHLIGHT_CREDIT_BLOTTER,
      (message: { tradeId: number }) => {
        setCreditTradeRowHighlight(message.tradeId)
      },
    )

    addEventListener(
      "notification-action",
      handler || handleHighlightCreditBlotterAction,
    )

    acceptedRfqWithQuote$.subscribe((rfq) => {
      sendQuoteAcceptedNotification(rfq)
    })
  }
}

export const unregisterCreditQuoteNotifications = () => {
  if (quotesReceivedSubscription) {
    quotesReceivedSubscription.unsubscribe()
  }
}
