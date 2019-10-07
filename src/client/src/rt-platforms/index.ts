import { WindowConfig, PlatformName } from './types'
import { ExternalWindow } from './externalWindowDefault'
import { BasePlatformAdapter } from './platformAdapter'
import { LimitChecker } from './limitChecker'
import { ExcelApp } from './excelApp'

export type LimitChecker = LimitChecker
export type ExcelApp = ExcelApp
export type PlatformAdapter = BasePlatformAdapter
export type WindowConfig = WindowConfig
export type PlatformName = PlatformName

export { Browser } from './browser'
export { Symphony, initiateSymphony } from './symphony'

export { OpenFin, OpenFinHeader, setupWorkspaces } from './openFin'
export { default as Finsemble } from './finsemble'
export { Glue42 } from './glue/glue'
export { InteropTopics } from './types'
export { default as platform } from './platform'
export { PlatformProvider, usePlatform } from './context'
export { externalWindowDefault } from './externalWindowDefault'
export { EXCEL_ADAPTER_NAME } from './excelApp'
export type ExternalWindow = ExternalWindow
