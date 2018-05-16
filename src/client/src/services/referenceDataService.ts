import { Observable } from 'rxjs'
import { map, publishReplay, refCount, scan } from 'rxjs/operators'
import { ServiceClient } from '../system/service'
import {
  CurrencyPair,
  CurrencyPairUpdates,
  ServiceConst,
  UpdateType
} from '../types'
import { referenceDataMapper } from './mappers'
import { RawCurrencyPairUpdates } from './mappers/referenceDataMapper'

export default class ReferenceDataService {
  private readonly referenceDataStream$: Observable<Map<string, CurrencyPair>>

  constructor(serviceClient: ServiceClient) {
    this.referenceDataStream$ = serviceClient
      .createStreamOperation<RawCurrencyPairUpdates>(
        ServiceConst.ReferenceServiceKey,
        'getCurrencyPairUpdatesStream',
        {}
      )
      .pipe(
        map(referenceDataMapper.mapCurrencyPairsFromDto),
        scan<CurrencyPairUpdates, Map<string, CurrencyPair>>((acc, update) => {
          const pairUpdates = update.currencyPairUpdates

          pairUpdates.forEach(currencyPairUpdate => {
            if (currencyPairUpdate.updateType === UpdateType.Added) {
              acc.set(
                currencyPairUpdate.currencyPair.symbol,
                currencyPairUpdate.currencyPair
              )
            } else {
              acc.delete(currencyPairUpdate.currencyPair.symbol)
            }
          })

          return acc
        }, new Map()),
        publishReplay(1),
        refCount()
      )
  }

  getCurrencyPairUpdates$() {
    return this.referenceDataStream$
  }
}
