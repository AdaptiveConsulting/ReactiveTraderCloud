export function getEnvironment(): string | undefined {
    const serviceUrl = process.env.REACT_APP_BROKER_HOST || window.location.host;

    if (serviceUrl.includes('localhost')) return 'localhost';

    const envMatch = /web-(?<env>[a-zA-Z]+)\.adaptivecluster\.com/.exec(serviceUrl)
    return envMatch ? envMatch['groups'].env : undefined
}