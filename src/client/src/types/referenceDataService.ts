import { Observable } from 'rxjs/Rx'

export interface ReferenceDataService {
  serviceStatusStream: Observable<any>
  getCurrencyPair: Function
  getCurrencyPairUpdatesStream: Observable<any>
}
