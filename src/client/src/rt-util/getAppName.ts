import { getEnvironment } from 'rt-util'

const prodEnvs = ['demo']
const acronymns = ['uat']

function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function capitalize(env: string): string {
  return acronymns.includes(env) ? env.toUpperCase() : capitalizeFirst(env)
}

export function getAppName(name: string = 'Reactive Trader'): string {
  const env = getEnvironment() || 'unknown'
  const envFormatted = prodEnvs.includes(env) ? '' : ` (${capitalize(env)})`

  return `${name}${envFormatted}`
}
