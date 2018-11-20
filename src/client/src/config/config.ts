interface Config {
  overwriteServerEndpoint: boolean
  serverEndpointUrl?: string
  serverPort?: string
}

interface ConfigMap {
  [key: string]: Config
}

const configMap: ConfigMap = {
  local: {
    overwriteServerEndpoint: true,
    serverEndpointUrl: 'localhost',
    serverPort: '8000',
  },
  docker: {
    overwriteServerEndpoint: true,
    serverEndpointUrl: '192.168.99.100',
  },
  dev: {
    overwriteServerEndpoint: true,
    serverEndpointUrl: 'web-dev.adaptivecluster.com',
  },
  demo: {
    overwriteServerEndpoint: true,
    serverEndpointUrl: 'web-demo.adaptivecluster.com',
  },
  default: {
    overwriteServerEndpoint: false,
  },
}

export const getEnvVars = (env: string) => {
  return configMap[env] ? configMap[env] : configMap['default']
}
