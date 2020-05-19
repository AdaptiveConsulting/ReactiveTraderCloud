export interface BotConfig {
  subdomain: string
  botUsername: string
  botEmailAddress: string
}

export function createConfig(
  botConfig: BotConfig,
  botPrivateKeyPath: string,
  botPrivateKeyName: string
) {
  return {
    sessionAuthHost: `${botConfig.subdomain}-api.symphony.com`,
    sessionAuthPort: 443,
    keyAuthHost: `${botConfig.subdomain}.symphony.com`,
    keyAuthPort: 443,
    podHost: `${botConfig.subdomain}.symphony.com`,
    podPort: 443,
    agentHost: `${botConfig.subdomain}.symphony.com`,
    agentPort: 443,
    authType: 'rsa',
    botCertPath: '',
    botCertName: '',
    botCertPassword: '',
    botPrivateKeyPath,
    botPrivateKeyName,
    botUsername: botConfig.botUsername,
    botEmailAddress: botConfig.botEmailAddress,
    appCertPath: '',
    appCertName: '',
    appCertPassword: '',
    proxyURL: '',
    proxyUsername: '',
    proxyPassword: '',
    authTokenRefreshPeriod: '30',
  }
}
