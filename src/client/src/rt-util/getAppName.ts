import { getEnvironment } from 'rt-util'
import { currencyFormatter } from './'
import { appTitles } from '../index'

const name = 'Reactive Trader'
const prodEnvs = ['demo']
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
    ? currencyFormatter(ccy)
    : pathname && pathname !== '/'
    ? ` - ${appTitles[pathname]}`
    : ``

  return `${name}${envFormatted}${` ${areaTitle}`}`
}
