import { init as workspacePlatformInit } from "@openfin/workspace-platform"

import {
  registerCreditQuoteAcceptedNotifications,
  registerCreditQuoteReceivedNotifications,
  registerCreditRfqCreatedNotifications,
  registerFxTradeNotifications,
} from "@/client/notifications.openfin"
import { initConnection } from "@/services/connection"
import { registerSimulatedDealerResponses } from "@/services/credit/creditRfqResponses"

import { customActions, overrideCallback } from "./browser"
import { BASE_URL } from "./constants"
import { deregisterDock, dockCustomActions, registerDock } from "./dock"
import { deregisterHome, registerHome, showHome } from "./home"
import {
  handleCreditNotificationEvents,
  handleFxNotificationEvents,
} from "./home/notifications"
import { deregisterStore, registerStore } from "./store"

const icon = `${BASE_URL}/images/icons/adaptive.png`

async function init() {
  await workspacePlatformInit({
    browser: {
      overrideCallback,
      defaultWindowOptions: {
        icon,
        workspacePlatform: {
          pages: [],
          favicon: icon,
        },
      },
    },
    customActions: { ...customActions, ...dockCustomActions },
    theme: [
      {
        label: "Dark",
        logoUrl: icon,
        palette: {
          brandPrimary: "#282E39",
          brandSecondary: "#FFF",
          backgroundPrimary: "#2F3542",
        },
      },
    ],
  })
  await registerHome()
  await registerStore()
  await registerDock()
  await showHome()

  registerFxTradeNotifications(handleFxNotificationEvents)
  registerCreditRfqCreatedNotifications(handleCreditNotificationEvents)
  registerCreditQuoteReceivedNotifications(handleCreditNotificationEvents)
  registerCreditQuoteAcceptedNotifications(handleCreditNotificationEvents)

  const simulatedDealersSubscription = registerSimulatedDealerResponses()

  await initConnection()

  const providerWindow = fin.Window.getCurrentSync()
  providerWindow.once("close-requested", async () => {
    // this runs _after_ the user clicks on confirm in the, well, confirmation dialog
    await deregisterHome()
    await deregisterStore()
    await deregisterDock()
    simulatedDealersSubscription.unsubscribe()
    fin.Platform.getCurrentSync().quit()
  })
}

window.addEventListener("DOMContentLoaded", async () => {
  await init()
})
