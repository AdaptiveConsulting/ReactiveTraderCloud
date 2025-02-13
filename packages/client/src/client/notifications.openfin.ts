import OpenFin from "@openfin/core"
import {
  addEventListener as addOpenFinNotificationsEventListener,
  ContainerTemplateFragment,
  create,
  CustomTemplateOptions,
  IndicatorColor,
  NotificationActionEvent,
  register,
  TemplateCustom,
  TemplateFragment,
  TextTemplateFragment,
} from "@openfin/workspace/notifications"
import * as CSS from "csstype"
import { Subscription } from "rxjs"

import {
  setCreditTradeRowHighlight,
  setFxTradeRowHighlight,
} from "@/client/App/Trades/TradesState"
import { Direction } from "@/generated/TradingGateway"
import {
  acceptedRfqWithQuote$,
  ConfirmCreatedCreditRfq,
  createdCreditConfirmation$,
  lastQuoteReceived$,
  PricedQuoteDetails,
  RfqWithPricedQuote,
} from "@/services/credit"
import { executions$, ExecutionTrade } from "@/services/executions"

import { isBuy } from "./App/Credit/common"
import { setCreditRfqCardHighlight } from "./App/Credit/CreditRfqs/CreditRfqCards"
import {
  processCreditQuoteReceived,
  processCreditRfqCreatedConfirmation,
  processCreditRfqWithAcceptedQuote,
  processFxExecution,
} from "./notificationsUtils"
import { colors } from "./theme"
import { constructUrl } from "./utils/constructUrl"

// OF Notification Service now requires explicit register()
// otherwise bad things happen! (duplicate Notifications Service instances, alerts on shutdown)
// on Mac at least ....
//
// Using simpler (deprecated) form of the register,
// per guide:    https://developers.openfin.co/of-docs/docs/register-notifications#register-platform
// and API Docs: https://developer.openfin.co/workspace/docs/api/latest/functions/notifications.register.html
// and https://github.com/built-on-openfin/workspace-starter/blob/main/how-to/workspace-platform-starter/docs/how-to-use-notifications.md
//
register()

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
              backgroundColor: isBuy(direction)
                ? colors.newThemeDark["Colors/Text/text-buy-primary"]
                : colors.newThemeDark["Colors/Text/text-sell-primary"],
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

const sendCreditRfqCreatedNotification = (
  rfqRequestConfirmation: ConfirmCreatedCreditRfq,
) => {
  const { title, rfqDetails } = processCreditRfqCreatedConfirmation(
    rfqRequestConfirmation,
  )

  const notificationOptions: TemplateCustom = {
    template: "custom",
    templateOptions: createNotificationTemplate(
      rfqRequestConfirmation.request.direction,
    ),
    templateData: {
      messageTradeDirection:
        rfqRequestConfirmation.request.direction.toUpperCase(),
      messageTradeDetails: rfqDetails,
    },

    icon: creditIconUrl,
    category: "RFQ Created",
    title,
    indicator: {
      text: "new rfq",
      color: IndicatorColor.YELLOW,
    },
    buttons: [
      {
        title: "View RFQ",
        onClick: {
          task: TASK_HIGHLIGHT_CREDIT_RFQ,
          payload: {
            rfqId: rfqRequestConfirmation.rfqId,
          },
        },
      },
    ],
  }

  create(notificationOptions)
}

const sendCreditQuoteReceivedNotification = (quote: PricedQuoteDetails) => {
  const { title, quoteDetails } = processCreditQuoteReceived(quote)

  const notificationOptions: TemplateCustom = {
    template: "custom",
    templateOptions: createNotificationTemplate(quote.direction),
    templateData: {
      messageTradeDirection: quote.direction.toUpperCase(),
      messageTradeDetails: quoteDetails,
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

const sendCreditQuoteAcceptedNotification = ({
  rfq,
  quote,
}: RfqWithPricedQuote) => {
  const { title, tradeDetails } = processCreditRfqWithAcceptedQuote(rfq, quote)

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

const TOPIC_HIGHLIGHT_FX_BLOTTER = "highlight-fx-blotter"
const TOPIC_HIGHLIGHT_CREDIT_RFQ = "highlight-credit-rfq"
// also used from RFQs tile, to highlight traded RFQ in blotter
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

export const handleHighlightRfqAction = (event: NotificationActionEvent) => {
  if (event.result.task === TASK_HIGHLIGHT_CREDIT_RFQ) {
    fin.InterApplicationBus.publish(
      TOPIC_HIGHLIGHT_CREDIT_RFQ,
      event.result.payload,
    )
  }
}

export const handleHighlightCreditBlotterAction = (
  event: NotificationActionEvent,
) => {
  if (event.result.task === TASK_HIGHLIGHT_CREDIT_TRADE) {
    fin.InterApplicationBus.publish(
      TOPIC_HIGHLIGHT_CREDIT_BLOTTER,
      event.result.payload,
    )
  }
}

export type NotificationActionHandler = (event: NotificationActionEvent) => void

let areFxTradeNotificationsRegistered = false
let executionSubscription: Subscription | null = null

export const registerFxTradeNotifications = (
  handler?: NotificationActionHandler,
) => {
  if (areFxTradeNotificationsRegistered) {
    return
  }
  areFxTradeNotificationsRegistered = true

  fin.InterApplicationBus.subscribe(
    { uuid: "*" },
    TOPIC_HIGHLIGHT_FX_BLOTTER,
    (message: { tradeId: number }) => setFxTradeRowHighlight(message.tradeId),
  )

  addOpenFinNotificationsEventListener(
    "notification-action",
    handler || handleHighlightFxBlotterAction,
  )

  executionSubscription = executions$.subscribe({
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

export const unregisterFxTradeNotifications = () => {
  if (executionSubscription) {
    executionSubscription.unsubscribe()
    executionSubscription = null
  }
  areFxTradeNotificationsRegistered = false
}

let areCreditRfqCreatedNotificationsRegistered = false
let creditRfqCreatedSubscription: Subscription | null = null

export const registerCreditRfqCreatedNotifications = (
  handler?: NotificationActionHandler,
) => {
  if (areCreditRfqCreatedNotificationsRegistered) {
    return
  }
  areCreditRfqCreatedNotificationsRegistered = true

  fin.InterApplicationBus.subscribe(
    { uuid: "*" },
    TOPIC_HIGHLIGHT_CREDIT_RFQ,
    (message: { rfqId: number }) => {
      setCreditRfqCardHighlight(message.rfqId)
    },
  )

  addOpenFinNotificationsEventListener(
    "notification-action",
    handler || handleHighlightRfqAction,
  )

  creditRfqCreatedSubscription = createdCreditConfirmation$.subscribe(
    (rfqRquest) => {
      sendCreditRfqCreatedNotification(rfqRquest)
    },
  )
}

export const unregisterCreditRfqCreatedNotifications = () => {
  if (creditRfqCreatedSubscription) {
    creditRfqCreatedSubscription.unsubscribe()
    creditRfqCreatedSubscription = null
  }
  areCreditRfqCreatedNotificationsRegistered = false
}

let areCreditQuoteReceivedNotificationsRegistered = false
let creditQuoteReceivedSubscription: Subscription | null = null

export const registerCreditQuoteReceivedNotifications = async (
  handler?: NotificationActionHandler,
) => {
  if (areCreditQuoteReceivedNotificationsRegistered) {
    return
  }
  areCreditQuoteReceivedNotificationsRegistered = true

  fin.InterApplicationBus.subscribe(
    { uuid: "*" },
    TOPIC_HIGHLIGHT_CREDIT_RFQ,
    (message: { rfqId: number }) => {
      setCreditRfqCardHighlight(message.rfqId)
    },
  )

  addOpenFinNotificationsEventListener(
    "notification-action",
    handler || handleHighlightRfqAction,
  )

  // we do not want to duplicate the subscription to the common quotes feed
  // as this will duplicate notifications
  // .. bit of TS type torture .. otherwise we cannot cleanly query the isView
  const isView = (fin.View.me as OpenFin.Me<OpenFin.EntityType>).isView
  if (isView) {
    const allApps = await fin.System.getAllApplications()
    const parentLauncherPlatform = allApps.find(
      (app) =>
        app.uuid.startsWith("adaptive-workspace-provider-local") ||
        app.uuid.startsWith("reactive-launcher"),
    )
    if (parentLauncherPlatform) {
      return
    }
  }

  creditQuoteReceivedSubscription = lastQuoteReceived$.subscribe({
    next: (quote) => {
      sendCreditQuoteReceivedNotification(quote)
    },
    error: (e) => {
      console.error(e)
    },
    complete: () => {
      console.error("credit quote notifications stream completed!?")
    },
  })
}

export const unregisterCreditQuoteReceivedNotifications = () => {
  if (creditQuoteReceivedSubscription) {
    creditQuoteReceivedSubscription.unsubscribe()
    creditQuoteReceivedSubscription = null
  }
  areCreditQuoteReceivedNotificationsRegistered = false
}

let areCreditQuoteAcceptedNotificationsRegistered = false
let creditQuoteAcceptedSubscription: Subscription | null = null

export const registerCreditQuoteAcceptedNotifications = (
  handler?: NotificationActionHandler,
) => {
  if (areCreditQuoteAcceptedNotificationsRegistered) {
    return
  }
  areCreditQuoteAcceptedNotificationsRegistered = true

  fin.InterApplicationBus.subscribe(
    { uuid: "*" },
    TOPIC_HIGHLIGHT_CREDIT_BLOTTER,
    (message: { tradeId: number }) => {
      setCreditTradeRowHighlight(message.tradeId)
    },
  )

  addOpenFinNotificationsEventListener(
    "notification-action",
    handler || handleHighlightCreditBlotterAction,
  )

  creditQuoteAcceptedSubscription = acceptedRfqWithQuote$.subscribe((rfq) => {
    sendCreditQuoteAcceptedNotification(rfq)
  })
}

export const unregisterCreditQuoteAcceptedNotifications = () => {
  if (creditQuoteAcceptedSubscription) {
    creditQuoteAcceptedSubscription.unsubscribe()
    creditQuoteAcceptedSubscription = null
  }
  areCreditQuoteAcceptedNotificationsRegistered = false
}
