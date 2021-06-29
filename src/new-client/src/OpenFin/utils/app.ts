export function getEnvironment(): string {
  const serviceUrl = window.location.host
  let envMatch

  if (serviceUrl.includes("localhost")) {
    return "local"
  }

  if (serviceUrl === "www.reactivetrader.com") {
    return "demo"
  }

  envMatch = /^(?<env>(?:dev|uat))\.reactivetrader\.com/.exec(serviceUrl)

  if (envMatch?.groups) {
    return envMatch.groups.env
  }

  envMatch = /web-(?<env>\w+)\.adaptivecluster\.com/.exec(serviceUrl)

  if (envMatch?.groups) {
    return envMatch.groups.env
  }

  envMatch = /^(?<env>\w+)\.lb\.adaptivecluster\.com/.exec(serviceUrl)

  if (envMatch?.groups) {
    return envMatch.groups.env
  }

  return "unknown"
}

const prodEnvs = ["demo"]

export function getAppName(name: string = "Reactive Trader®"): string {
  const env = getEnvironment() || "unknown"
  const envFormatted = prodEnvs.includes(env) ? "" : ` (${env.toUpperCase()})`

  return `${name}${envFormatted}`
}

/**
 * Gets the title of the first `content` element of the current Platform Layout
 */
export async function getPlatformLayoutTitle(): Promise<string | undefined> {
  const layout = fin.Platform.Layout.getCurrentSync()
  const config = await layout.getConfig()
  return config.content?.[0].title
}
