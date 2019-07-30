import { WindowConfig, PlatformName } from './types'
import OpenFin from './openfin/openFin'
import Browser from './browser/browser'
import Finsemble from './finsemble/finsemble'
import Glue42 from './glue/glue'

export type PlatformAdapter = OpenFin | Browser | Finsemble | Glue42
export type WindowConfig = WindowConfig
export type PlatformName = PlatformName
export { default as Browser } from './browser/browser'
export { default as OpenFin, setupWorkspaces } from './openfin/openFin'
export { default as Finsemble } from './finsemble/finsemble'
export { default as Glue42 } from './glue/glue'
export { excelAdapter } from './openfin/excel'
export { InteropTopics } from './types'
