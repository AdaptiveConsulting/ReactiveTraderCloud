interface Config {
  overwriteServerEndpoint: boolean,
  serverEndPointUrl?: string,
  serverPort?: string
}

type ConfigMap = { [key: string]: Config }

const configMap: ConfigMap = {
  local: {
    "overwriteServerEndpoint": true,
    "serverEndPointUrl": "localhost",
    "serverPort": '8000'
  },
  docker: {
    "overwriteServerEndpoint": true,
    "serverEndPointUrl": "192.168.99.100"
  },
  demo: {
    "overwriteServerEndpoint": true,
    "serverEndPointUrl": "web-demo.adaptivecluster.com"
  },
  default: {
    "overwriteServerEndpoint": false
  }
}

export const getEnvVars = (env: string) => {
  return configMap[env] ? configMap[env] : configMap['default']
}
