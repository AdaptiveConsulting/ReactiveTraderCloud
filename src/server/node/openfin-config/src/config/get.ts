import { OpenFinApplicationConfiguration } from '../types'
import appConfig from './app'
import launcherConfig from './launcher'

export default (type = 'app', env = 'demo'): OpenFinApplicationConfiguration => {
  switch (type) {
    case 'launcher':
      return launcherConfig(env)

    case 'app':
    default:
      return appConfig(env)
  }
}
