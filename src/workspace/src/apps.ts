import { App } from '@openfin/workspace'
import { BASE_URL } from './utils'

const { VITE_RT_URL, VITE_RA_URL } = import.meta.env as Record<string, string>

export async function getApps(): Promise<App[]> {
  return [
    reactiveTrader,
    reactiveAnalytics,
    limitChecker,
    reactiveWorkspace,
    liveRatesView,
    tradesView,
    analyticsView,
    reactiveAnalyticsView
  ]
}

const reactiveTraderManifestUrl = `${VITE_RT_URL}${VITE_RT_URL.includes('localhost') ? '/dist' : ''}/config/app.json`

export const reactiveTrader: App = {
  appId: 'reactive-trader',
  title: 'Reactive Trader',
  manifestType: 'manifest',
  description: 'Desktop Reactive Trader',
  manifest: reactiveTraderManifestUrl,
  icons: [
    {
      src: `${BASE_URL}/images/icons/reactive-trader.png`
    }
  ],
  publisher: 'Adaptive Financial Consulting',
  tags: ['Trading', 'Market Data', 'Analytics'],
  images: [{ src: `${BASE_URL}/images/previews/reactive-trader.PNG` }]
}

export const reactiveAnalytics: App = {
  appId: 'reactive-analytics',
  title: 'Reactive Analytics',
  manifestType: 'manifest',
  description: 'Desktop Reactive Analytics',
  manifest: `${VITE_RA_URL}/openfin/app.json`,
  icons: [
    {
      src: `${BASE_URL}/images/icons/reactive-analytics.png`
    }
  ],
  publisher: 'Adaptive Financial Consulting',
  tags: ['Market Data', 'Research'],
  images: [{ src: `${BASE_URL}/images/previews/reactive-analytics.PNG` }]
}

export const limitChecker: App = {
  appId: 'limit-checker',
  title: 'Limit Checker',
  manifestType: 'external',
  description: 'Reactive Trader Limit Checker',
  manifest:
    // Maps to appAssets alias in manifest.fin.json
    'LimitChecker',
  icons: [
    {
      src: `${BASE_URL}/images/icons/limit-checker.ico`
    }
  ],
  publisher: 'Adaptive Financial Consulting',
  tags: ['Trading', 'Tools'],
  images: [{ src: `${BASE_URL}/images/previews/limit-checker.PNG` }]
}

export const reactiveWorkspace: App = {
  appId: 'reactive-workspace',
  title: 'Trading Workspace',
  manifestType: 'snapshot',
  description: 'Live rates, blotter and analytics',
  manifest: `${BASE_URL}/config/snapshot.json`,
  icons: [
    {
      src: `${BASE_URL}/images/icons/reactive-trader.png`
    }
  ],
  publisher: 'OpenFin',
  tags: ['Trading', 'Market Data', 'Research'],
  images: [
    {
      src: `${BASE_URL}/images/previews/reactive-trader-snapshot.PNG`
    }
  ]
}

export const liveRatesView: App = {
  appId: 'live-rates-view',
  title: 'Live Rates',
  manifestType: 'view',
  description: 'Reactive Trader Live Rates',
  manifest: `${BASE_URL}/config/live-rates.json`,
  icons: [
    {
      src: `${BASE_URL}/images/icons/reactive-trader.png`
    }
  ],
  publisher: 'Adaptive Financial Consulting',
  tags: ['Market Data', 'Trading'],
  images: [{ src: `${BASE_URL}/images/previews/live-rates-view.PNG` }]
}

export const tradesView: App = {
  appId: 'trades-view',
  title: 'Trades',
  manifestType: 'view',
  description: 'Reactive Trader Trades',
  manifest: `${BASE_URL}/config/trades.json`,
  icons: [
    {
      src: `${BASE_URL}/images/icons/reactive-trader.png`
    }
  ],
  publisher: 'Adaptive Financial Consulting',
  tags: ['Trading'],
  images: [{ src: `${BASE_URL}/images/previews/trades-view.PNG` }]
}

export const analyticsView: App = {
  appId: 'analytics-view',
  title: 'Analytics',
  manifestType: 'view',
  description: 'Reactive Trader Analytics',
  manifest: `${BASE_URL}/config/analytics.json`,
  icons: [
    {
      src: `${BASE_URL}/images/icons/reactive-trader.png`
    }
  ],
  publisher: 'Adaptive Financial Consulting',
  tags: ['Analytics'],
  images: [{ src: `${BASE_URL}/images/previews/analytics-view.PNG` }]
}

export const reactiveAnalyticsView: App = {
  appId: 'reactive-analytics-view',
  title: 'Reactive Analytics',
  manifestType: 'view',
  description: 'Desktop Reactive Analytics',
  manifest: `${BASE_URL}/config/reactive-analytics.json`,
  icons: [
    {
      src: `${BASE_URL}/images/icons/reactive-analytics.png`
    }
  ],
  publisher: 'Adaptive Financial Consulting',
  tags: ['Market Data', 'Research'],
  images: [{ src: `${BASE_URL}/images/previews/reactive-analytics.PNG` }]
}
