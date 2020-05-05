import * as types from './types'
import * as externalWindowDefault from './externalWindowDefault'

export type WindowConfig = types.WindowConfig
export type WindowPosition = types.WindowPosition
export type TilesLayout = types.TilesLayout
export type PlatformName = types.PlatformName

export { InteropTopics } from './types'
export * from './platformWindow'
export * from './platform'
export * from './getPlatformAsync'
export { PlatformProvider, usePlatform } from './context'
export { externalWindowDefault } from './externalWindowDefault'
export * from './excelApp'
export * from './limitChecker'
<<<<<<< HEAD
export type ExternalWindow = externalWindowDefault.ExternalWindow
export { isParentAppLauncher } from './openFin'
||||||| parent of e7e24afb... bug(finsemble): fixes bug preventing finsemble from loading (ARTP-1136)
export { isParentAppLauncher } from './openFin'
=======
export { isParentAppOpenfinLauncher } from './openFin/adapter/launcherUtils'
>>>>>>> e7e24afb... bug(finsemble): fixes bug preventing finsemble from loading (ARTP-1136)
