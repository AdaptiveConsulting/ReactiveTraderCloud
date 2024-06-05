import { Dock, DockProvider } from "@openfin/workspace"

import { manifestUrls, WS_BASE_URL } from "./constants"
import { ADAPTIVE_LOGO } from "./home/utils"

const PROVIDER_ID = "adaptive-dock-provider"

export enum DockAction {
  OpenReactiveTraderFx = "open-reactive-trader-fx",
  OpenReactiveTraderCredit = "open-reactive-trader-credit",
  OpenReactiveAnalytics = "open-reactive-analytics",
  OpenLimitChecker = "open-limit-checker",
}

export const registerDock = () => {
  const dockProvider: DockProvider = {
    title: "Adaptive Workspace",
    id: PROVIDER_ID,
    icon: ADAPTIVE_LOGO,
    workspaceComponents: {
      hideWorkspacesButton: true,
    },
    skipSavedDockProviderConfig: true,
    buttons: [
      {
        tooltip: "Reactive Trader FX",
        iconUrl: `${WS_BASE_URL}/images/icons/reactive-trader-fx.png`,
        action: {
          id: DockAction.OpenReactiveTraderFx,
        },
      },
      {
        tooltip: "Reactive Trader Credit",
        iconUrl: `${WS_BASE_URL}/images/icons/reactive-trader-credit.png`,
        action: {
          id: DockAction.OpenReactiveTraderCredit,
        },
      },
    ],
  }

  Dock.register(dockProvider)
  return Dock.show()
}

export async function deregisterDock() {
  return Dock.deregister()
}

export const dockCustomActions = {
  [DockAction.OpenReactiveTraderFx]: () => {
    fin.Application.startFromManifest(manifestUrls.reactiveTrader)
  },
  [DockAction.OpenReactiveTraderCredit]: () => {
    fin.Application.startFromManifest(manifestUrls.reactiveCredit)
  },
}
