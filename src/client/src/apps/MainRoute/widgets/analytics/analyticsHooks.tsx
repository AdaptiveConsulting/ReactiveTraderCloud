import { connectObservable } from 'react-rxjs'
import { analyticsConnection$, history$, positions$ } from './analyticsService'
import { referenceDataService$ } from 'apps/MainRoute/store/singleServices'
export const [useHistory] = connectObservable(history$)
export const [usePositions] = connectObservable(positions$)
export const [useRefData] = connectObservable(referenceDataService$)
export const [useAnalyticsConnection] = connectObservable(analyticsConnection$)
