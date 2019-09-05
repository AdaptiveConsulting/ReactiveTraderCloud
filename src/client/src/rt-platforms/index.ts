import { WindowConfig, PlatformName } from './types'
import { ExternalWindow } from './externalWindowDefault'
import { LimitChecker } from './platformAdapter'

export type LimitChecker = LimitChecker
export type WindowConfig = WindowConfig
export type PlatformName = PlatformName

export { Browser } from './browser'
export { initiateSymphony } from './symphony'
export { excelAdapter, setupWorkspaces } from './openFin'

export { InteropTopics } from './types'
export { default as platform } from './platform'
export { PlatformProvider, usePlatform } from './context'
export { externalWindowDefault } from './externalWindowDefault'
export type ExternalWindow = ExternalWindow
