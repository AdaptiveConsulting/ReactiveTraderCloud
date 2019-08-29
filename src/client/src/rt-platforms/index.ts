import { WindowConfig, PlatformName } from './types'
import { ExternalWindow } from './externalWindowDefault'
import { BasePlatformAdapter, LimitChecker } from './platformAdapter'

export type LimitChecker = LimitChecker
export type PlatformAdapter = BasePlatformAdapter
export type WindowConfig = WindowConfig
export type PlatformName = PlatformName

export { Browser } from './browser'
export { Symphony, initiateSymphony } from './symphony'

export { OpenFin, setupWorkspaces, excelAdapter } from './openFin'
export { default as Finsemble } from './finsemble'
export { InteropTopics } from './types'
export { default as platform } from './platform'
export { PlatformProvider, usePlatform } from './context'
export { externalWindowDefault } from './externalWindowDefault'
export type ExternalWindow = ExternalWindow
