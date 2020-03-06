import appConfig from './app'
import launcherConfig from './launcher'
import platformConfig from './platform'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (type = 'app', env = 'demo') => {
  switch (type) {
    case 'launcher':
      return launcherConfig(env)

    case 'platform':
      return platformConfig(env)

    case 'app':
    default:
      return appConfig(env)
  }
}
