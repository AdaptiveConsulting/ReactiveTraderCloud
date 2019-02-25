import { PlatformAdapter, WindowConfig, openFinNotifications, setupGlobalOpenfinNotifications } from './adapters'
export { openFinNotifications, setupGlobalOpenfinNotifications }
export type PlatformAdapter = PlatformAdapter
export type WindowConfig = WindowConfig
export { default as platform } from './platform'
export { PlatformProvider, usePlatform } from './context'
export { externalWindowDefault } from './externalWindowDefault'
export { excelAdapter, InteropTopics } from './adapters'
