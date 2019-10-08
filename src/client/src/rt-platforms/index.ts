import { WindowConfig, WindowPosition, PlatformName } from './types'
import { ExternalWindow } from './externalWindowDefault'
import { BasePlatformAdapter } from './platformAdapter'

export type PlatformAdapter = BasePlatformAdapter
export type WindowConfig = WindowConfig
export type WindowPosition = WindowPosition
export type PlatformName = PlatformName

export { InteropTopics } from './types'
export * from './platform'
export { PlatformProvider, usePlatform } from './context'
export { externalWindowDefault } from './externalWindowDefault'
export * from './excelApp'
export * from './limitChecker'
export type ExternalWindow = ExternalWindow
