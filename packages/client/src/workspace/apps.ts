import { App } from "@openfin/workspace"

import { manifestUrls, WS_BASE_URL } from "./constants"
import { getCurrentUser, USER_TRADER } from "./user"

export function getApps(): App[] {
  return getCurrentUser() === USER_TRADER
    ? [reactiveTraderFx, reactiveTraderCredit]
    : [limitChecker]
}

export function getViews(): App[] {
  return getCurrentUser() === USER_TRADER
    ? [
        reactiveTraderFxLiveRatesView,
        reactiveTraderFxTradesView,
        reactiveTraderFxAnalyticsView,
      ]
    : [
        reactiveTraderFxTradesView,
        reactiveTraderFxAnalyticsView,
        limitCheckerView,
      ]
}

export function getSnapshots(): App[] {
  return getCurrentUser() === USER_TRADER ? [reactiveWorkspace] : []
}

export const reactiveTraderFx: App = {
  appId: "reactive-trader-fx",
  title: "Reactive Trader FX",
  description: "Reactive Trader FX",
  manifestType: "manifest",
  manifest: manifestUrls.reactiveTrader,
  icons: [{ src: `${WS_BASE_URL}/images/icons/reactive-trader.png` }],
  publisher: "Adaptive Financial Consulting",
  tags: ["FX", "Trading", "Market Data", "Analytics"],
  images: [{ src: `${WS_BASE_URL}/images/previews/reactive-trader.PNG` }],
}

export const reactiveTraderCredit: App = {
  appId: "reactive-trader-credit",
  title: "Reactive Trader Credit",
  manifestType: "manifest",
  description: "Reactive Trader Credit",
  manifest: manifestUrls.reactiveCredit,
  icons: [
    {
      src: `${WS_BASE_URL}/images/icons/reactive-trader-credit.png`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["Credit", "Trading", "Market Data", "Analytics"],
  images: [
    { src: `${WS_BASE_URL}/images/previews/reactive-trader-credit.png` },
  ],
}

export const limitChecker: App = {
  appId: "limit-checker",
  title: "Limit Checker",
  manifestType: "manifest",
  description: "Reactive Trader Limit Checker",
  manifest: manifestUrls.limitChecker,
  icons: [
    {
      src: `${WS_BASE_URL}/images/icons/limit-checker.ico`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["Trading", "Tools"],
  images: [{ src: `${WS_BASE_URL}/images/previews/limit-checker.png` }],
}

export const limitCheckerView: App = {
  appId: "limit-checker-view",
  title: "Limit Checker",
  manifestType: "view",
  description: "Reactive Trader Limit Checker",
  manifest: `${WS_BASE_URL}/config/limit-checker.json`,
  icons: [
    {
      src: `${WS_BASE_URL}/images/icons/limit-checker.ico`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["Trading", "Tools"],
  images: [{ src: `${WS_BASE_URL}/images/previews/limit-checker.png` }],
}

export const reactiveWorkspace: App = {
  appId: "reactive-workspace",
  title: "Trading Workspace",
  manifestType: "snapshot",
  description: "Live rates, blotter and analytics",
  manifest: `${WS_BASE_URL}/config/snapshot.json`,
  icons: [
    {
      src: `${WS_BASE_URL}/images/icons/reactive-trader.png`,
    },
  ],
  publisher: "OpenFin",
  tags: ["Trading", "Market Data", "Research"],
  images: [
    {
      src: `${WS_BASE_URL}/images/previews/trading-workspace-snapshot.png`,
    },
  ],
}

export const reactiveTraderFxLiveRatesView: App = {
  appId: "reactive-trader-fx-live-rates",
  title: "Reactive Trader FX - Live Rates",
  manifestType: "view",
  description: "Reactive Trader FX - Live Rates view",
  manifest: `${WS_BASE_URL}/config/fx-live-rates.json`,
  icons: [
    {
      src: `${WS_BASE_URL}/images/icons/reactive-trader.png`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["FX", "Market Data", "Trading"],
  images: [{ src: `${WS_BASE_URL}/images/previews/live-rates-view.PNG` }],
}

export const reactiveTraderFxTradesView: App = {
  appId: "reactive-trader-fx-trades-view",
  title: "Reactive Trader FX - Trades",
  manifestType: "view",
  description: "Reactive Trader FX - Trades view",
  manifest: `${WS_BASE_URL}/config/fx-trades.json`,
  icons: [
    {
      src: `${WS_BASE_URL}/images/icons/reactive-trader.png`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["FX", "Trading"],
  images: [{ src: `${WS_BASE_URL}/images/previews/trades-view.PNG` }],
}

export const reactiveTraderFxAnalyticsView: App = {
  appId: "reactive-trader-fx-analytics-view",
  title: "Reactive Trader FX - Analytics",
  manifestType: "view",
  description: "Reactive Trader - Analytics view",
  manifest: `${WS_BASE_URL}/config/fx-analytics.json`,
  icons: [
    {
      src: `${WS_BASE_URL}/images/icons/reactive-trader.png`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["FX", "Analytics"],
  images: [{ src: `${WS_BASE_URL}/images/previews/analytics-view.PNG` }],
}
