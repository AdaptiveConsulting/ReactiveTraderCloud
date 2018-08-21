import { compositeStatusServiceReducer } from './compositeStatus'
import { connectionStatusReducer } from './connectionStatus'
import { currencyPairReducer } from './referenceData/index'
import { regionsReducer } from './regions'
import { sidebarRegionReducer } from './sidebar'

export { default as Shell } from './Shell'
export { default as ShellContainer } from './ShellContainer'
export { default as OpenFinProvider } from './OpenFinProvider'
export { SHELL_ACTION_TYPES, ShellActions } from './actions'
export { Router } from './Router'
export { default as SidebarRegionContainer } from './sidebar'
export const reducers = {
  regionsService: regionsReducer,
  currencyPairs: currencyPairReducer,
  compositeStatusService: compositeStatusServiceReducer,
  connectionStatus: connectionStatusReducer,
  displayAnalytics: sidebarRegionReducer
}
