import { connectObservable } from 'react-rxjs'
import { allServiceStatus$ } from './services'
import { connection$ } from 'apps/MainRoute/store/singleServices'
export const [useConnectionStatus] = connectObservable(connection$)
export const [useServiceStatus] = connectObservable(allServiceStatus$)
