import { WindowConfig, PlatformName } from './types'
import OpenFin from './openfin/openFin';
import Browser from './browser/browser';
import Finsemble from './finsemble/finsemble';

export type PlatformAdapter = OpenFin | Browser | Finsemble
export type WindowConfig = WindowConfig
export type PlatformName = PlatformName
export { default as Browser } from './browser/browser'
export { default as OpenFin, openFinNotifications, setupGlobalOpenfinNotifications } from './openfin/openFin'
export { default as Finsemble } from './finsemble/finsemble'
export { excelAdapter } from './openfin/excel'
export { InteropTopics } from './types'
