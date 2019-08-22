import { WindowConfig, PlatformName } from './types'

import { BasePlatformAdapter } from './platformAdapter';

export type PlatformAdapter = BasePlatformAdapter
export type WindowConfig = WindowConfig
export type PlatformName = PlatformName
export { default as Browser } from './browser/browser'
export { default as Symphony } from './symphony/symphony'

export { default as OpenFin, setupWorkspaces } from './openFin/adapter/openFin'
export { default as Finsemble } from './finsemble/finsemble'
export { excelAdapter } from './openFin/adapter/excel'
export { InteropTopics } from './types'