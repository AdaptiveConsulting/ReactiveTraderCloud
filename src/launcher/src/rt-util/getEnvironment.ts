export function getEnvironment(): string {
  const serviceUrl = window.location.host

  if (serviceUrl.includes('localhost')) return 'local'

  const envMatch = /web-(?<env>[a-zA-Z]+)\.adaptivecluster\.com/.exec(serviceUrl)
  return envMatch ? envMatch['groups'].env : 'unknown'
}
