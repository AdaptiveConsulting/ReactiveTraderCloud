import { init as workspacePlatformInit } from "@openfin/workspace-platform"
import { registerHome, showHome, deregisterHome } from "./home"
import { registerStore, deregisterStore } from "./store"
import { registerFxNotifications } from "./home/notifications"
import { BASE_URL } from "./consts"
import { customActions, overrideCallback } from "./browser"
import { deregisterdock, dockCustomActions, registerDock } from "./dock"
import { initConnection } from "./services/connection"

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
  await registerFxNotifications()
  await registerStore()
  await registerDock()
  await showHome()

  await initConnection()

  const providerWindow = fin.Window.getCurrentSync()
  providerWindow.once("close-requested", async () => {
    await deregisterHome()
    await deregisterStore()
    await deregisterdock()
    fin.Platform.getCurrentSync().quit()
  })
}

window.addEventListener("DOMContentLoaded", async () => {
  await init()
})
