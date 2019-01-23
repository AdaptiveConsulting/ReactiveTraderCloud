import { PlatformAdapter } from './platformAdapter'
import { WindowConfig } from './types'

export type PlatformAdapter = PlatformAdapter
export type WindowConfig = WindowConfig
export { default as Browser } from './browser/browser'
export { default as OpenFin, openFinNotifications, setupGlobalOpenfinNotifications } from './openfin/openFin'
