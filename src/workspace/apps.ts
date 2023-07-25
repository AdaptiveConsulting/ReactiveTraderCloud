import { App } from "@openfin/workspace"

import { BASE_URL } from "./consts"
import { manifestUrls } from "./utils"

export async function getApps(): Promise<App[]> {
  return [
    reactiveTraderFx,
    reactiveTraderCredit,
    reactiveAnalytics,
    reactiveWorkspace,
    limitCheckerView,
    reactiveTraderFxLiveRatesView,
    reactiveTraderFxTradesView,
    reactiveTraderFxAnalyticsView,
    reactiveAnalyticsView,
  ]
}

export const reactiveTraderFx: App = {
  appId: "reactive-trader-fx",
  title: "Reactive Trader FX",
  manifestType: "manifest",
  description: "Reactive Trader FX",
  manifest: manifestUrls.reactiveTrader,
  icons: [
    {
      src: `${BASE_URL}/public-workspace/images/icons/reactive-trader.png`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["FX", "Trading", "Market Data", "Analytics"],
  images: [
    { src: `${BASE_URL}/public-workspace/images/previews/reactive-trader.PNG` },
  ],
}

export const reactiveTraderCredit: App = {
  appId: "reactive-trader-credit",
  title: "Reactive Trader Credit",
  manifestType: "manifest",
  description: "Reactive Trader Credit",
  manifest: manifestUrls.reactiveCredit,
  icons: [
    {
      src: `${BASE_URL}/public-workspace/images/icons/reactive-trader.png`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["Credit", "Trading", "Market Data", "Analytics"],
  images: [
    { src: `${BASE_URL}/public-workspace/images/previews/reactive-trader.PNG` },
  ],
}

export const reactiveAnalytics: App = {
  appId: "reactive-analytics",
  title: "Reactive Analytics",
  manifestType: "manifest",
  description: "Reactive Analytics",
  manifest: manifestUrls.reactiveAnalytics,
  icons: [
    {
      src: `${BASE_URL}/public-workspace/images/icons/reactive-analytics.png`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["Market Data", "Research"],
  images: [
    {
      src: `${BASE_URL}/public-workspace/images/previews/reactive-analytics.PNG`,
    },
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
      src: `${BASE_URL}/public-workspace/images/icons/limit-checker.ico`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["Trading", "Tools"],
  images: [
    { src: `${BASE_URL}/public-workspace/images/previews/limit-checker.PNG` },
  ],
}

export const limitCheckerView: App = {
  appId: "limit-checker-view",
  title: "Limit Checker",
  manifestType: "view",
  description: "Reactive Trader Limit Checker",
  manifest: `${BASE_URL}/config/limit-checker.json`,
  icons: [
    {
      src: `${BASE_URL}/public-workspace/images/icons/limit-checker.ico`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["Trading", "Tools"],
  images: [
    { src: `${BASE_URL}/public-workspace/images/previews/limit-checker.PNG` },
  ],
}

export const reactiveWorkspace: App = {
  appId: "reactive-workspace",
  title: "Trading Workspace",
  manifestType: "snapshot",
  description: "Live rates, blotter and analytics",
  manifest: `${BASE_URL}/src/workspace/config/snapshot.json`,
  icons: [
    {
      src: `${BASE_URL}/public-workspace/images/icons/reactive-trader.png`,
    },
  ],
  publisher: "OpenFin",
  tags: ["Trading", "Market Data", "Research"],
  images: [
    {
      src: `${BASE_URL}/public-workspace/images/previews/reactive-trader-snapshot.PNG`,
    },
  ],
}

export const reactiveTraderFxLiveRatesView: App = {
  appId: "reactive-trader-fx-live-rates",
  title: "Reactive Trader FX - Live Rates",
  manifestType: "view",
  description: "Reactive Trader FX - Live Rates view",
  manifest: `${BASE_URL}/config/fx-live-rates.json`,
  icons: [
    {
      src: `${BASE_URL}/public-workspace/images/icons/reactive-trader.png`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["FX", "Market Data", "Trading"],
  images: [
    { src: `${BASE_URL}/public-workspace/images/previews/live-rates-view.PNG` },
  ],
}

export const reactiveTraderFxTradesView: App = {
  appId: "reactive-trader-fx-trades-view",
  title: "Reactive Trader FX - Trades",
  manifestType: "view",
  description: "Reactive Trader FX - Trades view",
  manifest: `${BASE_URL}/config/fx-trades.json`,
  icons: [
    {
      src: `${BASE_URL}/public-workspace/images/icons/reactive-trader.png`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["FX", "Trading"],
  images: [
    { src: `${BASE_URL}/public-workspace/images/previews/trades-view.PNG` },
  ],
}

export const reactiveTraderFxAnalyticsView: App = {
  appId: "reactive-trader-fx-analytics-view",
  title: "Reactive Trader FX - Analytics",
  manifestType: "view",
  description: "Reactive Trader - Analytics view",
  manifest: `${BASE_URL}/config/fx-analytics.json`,
  icons: [
    {
      src: `${BASE_URL}/public-workspace/images/icons/reactive-trader.png`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["FX", "Analytics"],
  images: [
    { src: `${BASE_URL}/public-workspace/images/previews/analytics-view.PNG` },
  ],
}

export const reactiveAnalyticsView: App = {
  appId: "reactive-analytics-view",
  title: "Reactive Analytics",
  manifestType: "view",
  description: "Reactive Analytics",
  manifest: `${BASE_URL}/config/reactive-analytics.json`,
  icons: [
    {
      src: `${BASE_URL}/public-workspace/images/icons/reactive-analytics.png`,
    },
  ],
  publisher: "Adaptive Financial Consulting",
  tags: ["Market Data", "Research"],
  images: [
    {
      src: `${BASE_URL}/public-workspace/images/previews/reactive-analytics.PNG`,
    },
  ],
}
