import OpenFin from "@openfin/core"
import type { NotificationActionEvent } from "@openfin/workspace/notifications"
import { getCurrentSync } from "@openfin/workspace-platform"

import {
  handleHighlightCreditBlotterAction,
  handleHighlightFxBlotterAction,
  handleHighlightRfqAction,
  TASK_HIGHLIGHT_CREDIT_RFQ,
  TASK_HIGHLIGHT_CREDIT_TRADE,
  TASK_HIGHLIGHT_FX_TRADE,
} from "@/client/notifications.openfin"
import { RT_PLATFORM_UUID_PREFIX } from "@/client/OpenFin/utils/window"

import { VITE_RT_URL } from "../constants"

let openingCreditRfqsView = false
let creditRfqsView: OpenFin.View | null = null
let openingCreditBlotterView = false
let creditBlotterView: OpenFin.View | null = null

export const handleCreditNotificationEvents = async (
  event: NotificationActionEvent,
) => {
  const apps = await fin.System.getAllApplications()
  const creditApp = apps.find((app) =>
    app.uuid.includes(`${RT_PLATFORM_UUID_PREFIX}credit`),
  )
  const isRTCreditAppOpen = creditApp?.isRunning

  if (event.result.task === TASK_HIGHLIGHT_CREDIT_RFQ) {
    // if RT Credit app is already open, highlight the rfq
    if (isRTCreditAppOpen) {
      console.debug("Credit app is running, highlight RFQ", creditApp.uuid)
      const creditAppWindow = await fin.Application.wrapSync({
        uuid: creditApp.uuid,
      }).getWindow()
      creditAppWindow.bringToFront()
      handleHighlightRfqAction(event)
      return
    }

    // (or just focus it if we opened one earlier and it is still there)
    if (creditRfqsView) {
      console.debug(
        "credit rfqs view is running, highlight RFQ",
        creditRfqsView.identity.uuid,
      )
      creditRfqsView.focus()
      handleHighlightRfqAction(event)
      return
    }

    // otherwise open a new Credit RFQs view,
    // and block out any other handlers from doing the same
    if (!openingCreditRfqsView) {
      openingCreditRfqsView = true

      const platform = getCurrentSync()
      creditRfqsView = await platform.createView({
        url: `${VITE_RT_URL}/credit-rfqs`,
        bounds: { width: 320, height: 180, top: 0, left: 0 },
      })

      creditRfqsView.on("destroyed", () => {
        creditRfqsView?.removeAllListeners()
        creditRfqsView = null
      })
      openingCreditRfqsView = false
    }
  }

  if (event.result.task === TASK_HIGHLIGHT_CREDIT_TRADE) {
    // if RT Credit app is already open, highlight the trade
    if (isRTCreditAppOpen) {
      handleHighlightCreditBlotterAction(event)
      return
    }

    // (or just focus it if we opened one earlier and it is still there)
    if (creditBlotterView) {
      creditBlotterView.focus()
      handleHighlightCreditBlotterAction(event)
      return
    }

    // otherwise open a new Credit RFQs view,
    // and block out any other handlers from doing the same
    if (!openingCreditBlotterView) {
      openingCreditBlotterView = true

      const platform = getCurrentSync()
      creditBlotterView = await platform.createView({
        url: `${VITE_RT_URL}/credit-blotter`,
        bounds: { width: 320, height: 180, top: 0, left: 0 },
      })

      creditBlotterView.on("destroyed", () => {
        creditBlotterView?.removeAllListeners()
        creditBlotterView = null
      })
      openingCreditBlotterView = false
    }
  }
}

let blotterView: OpenFin.View | null = null
export const handleFxNotificationEvents = async (
  event: NotificationActionEvent,
) => {
  if (event.result.task !== TASK_HIGHLIGHT_FX_TRADE) {
    return
  }

  const apps = await fin.System.getAllApplications()
  const fxApp = apps.find((app) =>
    app.uuid.includes(`${RT_PLATFORM_UUID_PREFIX}fx`),
  )
  const isFxOpen = fxApp?.isRunning

  if (isFxOpen) {
    console.debug("FX app is running, highlight trade in blotter", fxApp.uuid)
    const fxAppWindow = await fin.Application.wrapSync({
      uuid: fxApp.uuid,
    }).getWindow()
    fxAppWindow.bringToFront()
    handleHighlightFxBlotterAction(event)
    return
  }

  if (blotterView) {
    console.debug(
      "blotter view is running, highlight trade in blotter",
      blotterView.identity.uuid,
    )
    blotterView.focus()
    handleHighlightFxBlotterAction(event)
    return
  }

  const platform = getCurrentSync()

  blotterView = await platform.createView({
    url: `${VITE_RT_URL}/fx-blotter`,
    bounds: { width: 320, height: 180, top: 0, left: 0 },
  })

  blotterView.on("destroyed", () => {
    blotterView?.removeAllListeners()
    blotterView = null
  })
}
