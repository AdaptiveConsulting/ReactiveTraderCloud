/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { OpenFinApplicationConfiguration } from '../types'
import appConfig from './app'
import launcherConfig from './launcher'

/* eslint-disable @typescript-eslint/camelcase */
export default (type = 'app', env = 'demo'): OpenFinApplicationConfiguration => {
  switch (type) {
    case 'launcher':
      return launcherConfig(env)
      break

    case 'app':
    default:
      return appConfig(env)
  }
}
