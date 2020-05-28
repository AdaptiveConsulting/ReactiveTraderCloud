import { getEnvironment } from 'rt-util'
import { currencyFormatter } from './'

const name = 'Reactive Trader'
const prodEnvs = ['demo']

export const APP_PATHS = {
  LAUNCHER: '/launcher',
  TRADER: '/',
  STYLEGUIDE: '/styleguide',
  BLOTTER: '/blotter',
  ANALYTICS: '/analytics',
  TILES: '/tiles',
}

export const appTitles = {
  [APP_PATHS.LAUNCHER]: 'Reactive Launcher',
  [APP_PATHS.TRADER]: 'Reactive Trader',
  [APP_PATHS.STYLEGUIDE]: 'Style Guide for Reactive Trader',
  [APP_PATHS.BLOTTER]: 'Trades',
  [APP_PATHS.ANALYTICS]: 'Analytics',
  [APP_PATHS.TILES]: 'Live Rates',
}

const currencyPairs = [
  'EURUSD',
  'USDJPY',
  'GBPUSD',
  'GBPJPY',
  'EURJPY',
  'AUDUSD',
  'NZDUSD',
  'EURCAD',
  'EURAUD',
]

export function getAppName(pathname?: string): string {
  const env = getEnvironment() || 'unknown'
  const envFormatted = prodEnvs.includes(env) ? '' : ` (${env.toUpperCase()})`

  const ccy = pathname ? pathname.slice(6, 12) : ``
  const areaTitle = currencyPairs.includes(ccy)
    ? `- ${currencyFormatter(ccy)}`
    : pathname && pathname !== '/'
    ? ` - ${appTitles[pathname]}`
    : ``

  return `${name}${envFormatted}${` ${areaTitle}`}`
}
