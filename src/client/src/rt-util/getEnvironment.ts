export function getEnvironment(): string {
  const serviceUrl = window.location.host
  let envMatch

  if (serviceUrl.includes('localhost')) {
    return 'local'
  }

  if (serviceUrl === 'www.reactivetrader.com') {
    return 'demo'
  }

  envMatch = /^(?<env>(?:dev|uat))\.reactivetrader\.com/.exec(serviceUrl)

  if (envMatch) {
    return envMatch['groups'].env
  }

  envMatch = /web-(?<env>\w+)\.adaptivecluster\.com/.exec(serviceUrl)

  if (envMatch) {
    return envMatch['groups'].env
  }

  envMatch = /^(?<env>\w+)\.lb\.adaptivecluster\.com/.exec(serviceUrl)

  if (envMatch) {
    return envMatch['groups'].env
  }

  return 'unknown'
}
