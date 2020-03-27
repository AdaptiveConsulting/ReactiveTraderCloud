import { compositeStatusServiceReducer } from './compositeStatus'
import { connectionStatusReducer } from './connectionStatus'
import { currencyPairReducer } from './referenceData'
import { userStatusReducer } from './userStatus'

export { Router } from '../Router'
export const reducers = {
  currencyPairs: currencyPairReducer,
  compositeStatusService: compositeStatusServiceReducer,
  connectionStatus: connectionStatusReducer,
  userStatus: userStatusReducer,
}
