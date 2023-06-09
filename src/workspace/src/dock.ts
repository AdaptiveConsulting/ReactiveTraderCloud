import { limitChecker, reactiveAnalytics, reactiveTraderCredit } from "@/apps"
import { reactiveTraderFx } from "@/apps"
import { BASE_URL } from "@/consts"
import { ADAPTIVE_LOGO } from "@/home/utils"
import { Dock, DockProvider } from "@openfin/workspace"
import { getCurrentSync } from "@openfin/workspace-platform"

export enum DockAction {
  OpenReactiveTraderFx = "open-reactive-trader-fx",
  OpenReactiveTraderCredit = "open-reactive-trader-credit",
  OpenReactiveAnalytics = "open-reactive-analytics",
  OpenLimitChecker = "open-limit-checker",
}

export const registerDock = () => {
  const dockProvider: DockProvider = {
    title: "Adaptive Workspace",
    id: "dock",
    icon: ADAPTIVE_LOGO,
    workspaceComponents: {
      hideWorkspacesButton: true,
    },
    buttons: [
      {
        tooltip: "Reactive Trader FX",
        iconUrl: `${BASE_URL}/images/icons/reactive-trader-fx.png`,
        action: {
          id: DockAction.OpenReactiveTraderFx,
        },
      },
      {
        tooltip: "Reactive Trader Credit",
        iconUrl: `${BASE_URL}/images/icons/reactive-trader-credit.png`,
        action: {
          id: DockAction.OpenReactiveTraderCredit,
        },
      },
      {
        tooltip: "Reactive Analytics",
        iconUrl: `${BASE_URL}/images/icons/reactive-analytics-2.png`,
        action: {
          id: DockAction.OpenReactiveAnalytics,
        },
      },
      {
        tooltip: "Limit Checker",
        iconUrl: `${BASE_URL}/images/icons/limit-checker.png`,
        action: {
          id: DockAction.OpenLimitChecker,
        },
      },
    ],
  }

  Dock.register(dockProvider)
  return Dock.show()
}

const platform = getCurrentSync()

export const dockCustomActions = {
  [DockAction.OpenReactiveTraderFx]: () => {
    platform.launchApp({ app: reactiveTraderFx })
  },
  [DockAction.OpenReactiveTraderCredit]: () => {
    platform.launchApp({ app: reactiveTraderCredit })
  },
  [DockAction.OpenReactiveAnalytics]: () => {
    platform.launchApp({ app: reactiveAnalytics })
  },
  [DockAction.OpenLimitChecker]: () => {
    platform.launchApp({
      app: limitChecker,
    })
  },
}
