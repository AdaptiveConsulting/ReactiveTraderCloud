import { compositeStatusServiceReducer } from './compositeStatus'
import { connectionStatusReducer } from './connectionStatus'
import { currencyPairReducer } from './referenceData'
import { layoutReducer } from '../layouts/reducer'

export { Router } from '../Router'
export const reducers = {
  currencyPairs: currencyPairReducer,
  compositeStatusService: compositeStatusServiceReducer,
  connectionStatus: connectionStatusReducer,
  layout: layoutReducer,
}
