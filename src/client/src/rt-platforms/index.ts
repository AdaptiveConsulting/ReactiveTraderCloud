import { WindowConfig, PlatformName } from './types'
import { ExternalWindow } from './externalWindowDefault'
import { BasePlatformAdapter, LimitChecker } from './platformAdapter'
import { PlatformWrapper } from './platform'

export type LimitChecker = LimitChecker
export type WindowConfig = WindowConfig
export type PlatformAdapter = BasePlatformAdapter
export type PlatformWrapper = PlatformWrapper
export type PlatformName = PlatformName

export { Browser } from './browser'
export { initiateSymphony } from './symphony'
export { excelAdapter, setupWorkspaces } from './openFin'

export { InteropTopics } from './types'
export { default as platform, loadPlatform } from './platform'
export { PlatformProvider, usePlatform } from './context'
export { externalWindowDefault } from './externalWindowDefault'
export type ExternalWindow = ExternalWindow
