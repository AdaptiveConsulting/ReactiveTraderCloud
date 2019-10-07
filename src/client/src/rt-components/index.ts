import {
  PlatformAdapter,
  externalWindowDefault,
  PlatformProvider,
  PlatformName,
  WindowConfig,
  setupWorkspaces,
  usePlatform,
  ExternalWindow,
} from 'rt-platforms'

export { usePlatform, externalWindowDefault, PlatformProvider, setupWorkspaces }
export type PlatformAdapter = PlatformAdapter
export type PlatformName = PlatformName
export type WindowConfig = WindowConfig
export { TearOff } from './tear-off'
export { Flex, flexStyle } from './flex'
export { PopoutIcon, ExpandIcon, LogoIcon } from './icons'
export { default as Modal } from './modal'
export { default as AdaptiveLoader } from './adaptive-loader'
export { default as Loadable } from './loadable'
export { default as Resizer } from './resizer'
export { Timer } from './timer'
export { RouteWrapper, RouteStyle } from './route-wrapper'
export { default as Popup } from './popup'
export { InteropTopics, Browser, OpenFin, Finsemble, EXCEL_ADAPTER_NAME } from 'rt-platforms'
export type ExternalWindow = ExternalWindow
