import { PlatformAdapter, WindowConfig, openFinNotifications, setupGlobalOpenfinNotifications } from './adapters'
export { openFinNotifications, setupGlobalOpenfinNotifications }
export type PlatformAdapter = PlatformAdapter
export type WindowConfig = WindowConfig
export { default as Platform } from './platform'
export { PlatformProvider } from './context'
export { withPlatform } from './withPlatform'
export { externalWindowDefault } from './externalWindowDefault'
export { excelAdapter, InteropTopics } from './adapters'
