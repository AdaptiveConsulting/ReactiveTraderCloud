import { init as workspacePlatformInit } from "@openfin/workspace-platform"

import {
  registerCreditNotifications,
  registerFxNotifications,
} from "@/client/notifications.openfin"
import { initConnection } from "@/services/connection"
import { registerSimulatedDealerResponses } from "@/services/credit/creditRfqResponses"

import { customActions, overrideCallback } from "./browser"
import { BASE_URL } from "./constants"
import { deregisterdock, dockCustomActions, registerDock } from "./dock"
import { deregisterHome, registerHome, showHome } from "./home"
import {
  handleCreditRfqNotification,
  handleFxTradeNotification,
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

  registerFxNotifications(handleFxTradeNotification)
  registerCreditNotifications(handleCreditRfqNotification)

  const sub = registerSimulatedDealerResponses()

  await initConnection()

  const providerWindow = fin.Window.getCurrentSync()
  providerWindow.once("close-requested", async () => {
    await deregisterHome()
    await deregisterStore()
    await deregisterdock()
    sub.unsubscribe()
    fin.Platform.getCurrentSync().quit()
  })
}

window.addEventListener("DOMContentLoaded", async () => {
  await init()
})
