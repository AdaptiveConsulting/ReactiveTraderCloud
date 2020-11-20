import { getEnvironment } from 'rt-util'

const prodEnvs = ['demo']

export function getAppName(name: string = 'Reactive Trader®'): string {
  const env = getEnvironment() || 'unknown'
  const envFormatted = prodEnvs.includes(env) ? '' : ` (${env.toUpperCase()})`

  return `${name}${envFormatted}`
}
