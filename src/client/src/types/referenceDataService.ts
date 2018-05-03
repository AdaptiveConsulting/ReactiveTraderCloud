import { Observable } from 'rxjs'
import {
  CurrencyPair,
  CurrencyPairUpdates,
  ServiceStatus,
  StatusService
} from '.'

export interface ReferenceDataService extends StatusService {
  getCurrencyPair: (symbol: string) => CurrencyPair
  getCurrencyPairUpdatesStream: () => Observable<CurrencyPairUpdates>
}
