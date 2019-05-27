import { PlatformAdapter, WindowConfig, PlatformName } from './adapters'
export type PlatformAdapter = PlatformAdapter
export type WindowConfig = WindowConfig
export type PlatformName = PlatformName
export {
  excelAdapter,
  InteropTopics,
  Browser,
  OpenFin,
  Finsemble,
  openFinNotifications,
} from './adapters'
export { default as platform } from './platform'
export { PlatformProvider, usePlatform } from './context'
export { externalWindowDefault } from './externalWindowDefault'
