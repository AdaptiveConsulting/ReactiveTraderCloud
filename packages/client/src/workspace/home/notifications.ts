import { View } from "@openfin/core/src/OpenFin"
import { getCurrentSync } from "@openfin/workspace-platform"
import { NotificationActionEvent } from "openfin-notifications"

import {
  handleHighlightFxBlotterAction,
  handleHighlightRfqAction,
  TASK_HIGHLIGHT_CREDIT_RFQ,
  TASK_HIGHLIGHT_FX_TRADE,
} from "@/client/notifications.openfin"
import { RT_PLATFORM_UUID_PREFIX } from "@/client/OpenFin/utils/window"

import { VITE_RT_URL } from "../constants"

let rfqsView: View | null = null
export const handleCreditRfqNotification = async (
  event: NotificationActionEvent,
) => {
  if (event.result.task === TASK_HIGHLIGHT_CREDIT_RFQ) {
    const apps = await fin.System.getAllApplications()

    const isCreditOpen = apps.find((app) =>
      app.uuid.includes(`${RT_PLATFORM_UUID_PREFIX}credit`),
    )?.isRunning

    //if credit is already open, highlight the rfq
    if (isCreditOpen) {
      handleHighlightRfqAction(event)
    } else if (!rfqsView) {
      //else open an rfqs view
      const platform = getCurrentSync()

      rfqsView = await platform.createView({
        url: `${VITE_RT_URL}/credit-rfqs`,
        bounds: { width: 320, height: 180, top: 0, left: 0 },
      })

      rfqsView.on("destroyed", () => {
        rfqsView?.removeAllListeners()
        rfqsView = null
      })
    } else {
      rfqsView.focus()
    }
  }
}

let blotterView: View | null = null
export const handleFxTradeNotification = async (
  event: NotificationActionEvent,
) => {
  if (event.result.task === TASK_HIGHLIGHT_FX_TRADE) {
    const apps = await fin.System.getAllApplications()

    const isFxOpen = apps.find((app) =>
      app.uuid.includes(`${RT_PLATFORM_UUID_PREFIX}fx`),
    )?.isRunning

    if (isFxOpen) {
      handleHighlightFxBlotterAction(event)
    } else if (!blotterView) {
      const platform = getCurrentSync()

      blotterView = await platform.createView({
        url: `${VITE_RT_URL}/fx-blotter`,
        bounds: { width: 320, height: 180, top: 0, left: 0 },
      })

      blotterView.on("destroyed", () => {
        blotterView?.removeAllListeners()
        blotterView = null
      })
    } else {
      blotterView.focus()
    }
  }
}
