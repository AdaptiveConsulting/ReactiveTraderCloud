import { WindowConfig, PlatformName } from './types'
import { ExternalWindow } from './externalWindowDefault'
import { BasePlatformAdapter } from './platformAdapter'

export type PlatformAdapter = BasePlatformAdapter
export type WindowConfig = WindowConfig
export type PlatformName = PlatformName

export { default as Browser } from './browser/browser'
export { default as Symphony } from './symphony/adapter/symphony'

export { default as OpenFin, setupWorkspaces } from './openFin/adapter/openFin'
export { default as OpenFinRoute } from './openFin/adapter/OpenFinRoute'
export { default as Finsemble } from './finsemble/finsemble'
export { excelAdapter } from './openFin/adapter/excel'
export { InteropTopics } from './types'
export { default as platform } from './platform'
export { PlatformProvider, usePlatform } from './context'
export { externalWindowDefault } from './externalWindowDefault'
export type ExternalWindow = ExternalWindow
