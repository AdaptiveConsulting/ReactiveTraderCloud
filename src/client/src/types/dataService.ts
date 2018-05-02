import { Observable } from 'rxjs'
import { CurrencyPair, CurrencyPairUpdates, ServiceStatus } from '.'

export interface ReferenceDataService {
  serviceStatusStream: Observable<ServiceStatus>
  getCurrencyPair: (symbol: string) => CurrencyPair
  getCurrencyPairUpdatesStream: () => Observable<CurrencyPairUpdates>
}
