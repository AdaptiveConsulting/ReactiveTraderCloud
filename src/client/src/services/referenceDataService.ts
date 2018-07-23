import { RawCurrencyPairUpdates, referenceDataMapper } from 'common/parsers'
import { CurrencyPairMap, CurrencyPairUpdates, UpdateType } from 'common/types'
import { Observable } from 'rxjs'
import { map, publishReplay, refCount, scan } from 'rxjs/operators'
import { ServiceClient } from '../system'

export default class ReferenceDataService {
  private readonly referenceDataStream$: Observable<CurrencyPairMap>

  constructor(serviceClient: ServiceClient) {
    this.referenceDataStream$ = serviceClient
      .createStreamOperation<RawCurrencyPairUpdates>('reference', 'getCurrencyPairUpdatesStream', {})
      .pipe(
        map(referenceDataMapper.mapCurrencyPairsFromDto),
        scan<CurrencyPairUpdates, CurrencyPairMap>((acc, update) => {
          const pairUpdates = update.currencyPairUpdates

          pairUpdates.forEach(currencyPairUpdate => {
            if (currencyPairUpdate.updateType === UpdateType.Added) {
              acc[currencyPairUpdate.currencyPair.symbol] = currencyPairUpdate.currencyPair
            } else {
              delete acc[currencyPairUpdate.currencyPair.symbol]
            }
          })

          return acc
        }, {}),
        publishReplay(1),
        refCount()
      )
  }

  getCurrencyPairUpdates$() {
    return this.referenceDataStream$
  }
}
