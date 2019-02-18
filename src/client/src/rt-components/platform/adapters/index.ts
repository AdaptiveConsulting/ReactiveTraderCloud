import { PlatformAdapter } from './platformAdapter'
import { WindowConfig } from './types'

export type PlatformAdapter = PlatformAdapter
export type WindowConfig = WindowConfig
export { default as Browser } from './browser/browser'
export { default as OpenFin, openFinNotifications, setupGlobalOpenfinNotifications } from './openfin/openFin'
export { default as Finsemble } from './finsemble/finsemble'
export { default as ExcelService } from './openfin/excel'
export { InteropTopics } from './types'
