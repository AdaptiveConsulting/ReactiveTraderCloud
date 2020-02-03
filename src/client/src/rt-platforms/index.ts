import * as types from './types'
import * as externalWindowDefault from './externalWindowDefault'

export type WindowConfig = types.WindowConfig
export type WindowPosition = types.WindowPosition
export type PlatformName = types.PlatformName

export { InteropTopics } from './types'
export * from './platformWindow'
export * from './platform'
export * from './getPlatformAsync'
export { PlatformProvider, usePlatform } from './context'
export { externalWindowDefault } from './externalWindowDefault'
export * from './excelApp'
export * from './limitChecker'
export type ExternalWindow = externalWindowDefault.ExternalWindow
