export function getEnvironment(): string {
  const serviceUrl = window.location.host

  if (serviceUrl.includes('localhost')) return 'local'

  const envMatch = /web-(?<env>\w+)\.adaptivecluster\.com/.exec(serviceUrl)
  return envMatch ? envMatch['groups'].env : 'unknown'
}
