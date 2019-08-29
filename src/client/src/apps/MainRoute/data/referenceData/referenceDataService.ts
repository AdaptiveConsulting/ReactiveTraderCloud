import { ServiceStubWithLoadBalancer as ServiceClient } from 'rt-system'
import { CurrencyPairMap, UpdateType } from 'rt-types'
import { map, publishReplay, refCount, scan } from 'rxjs/operators'
import { CurrencyPairUpdates } from './currencyPairUpdates'
import { default as referenceDataMapper, RawCurrencyPairUpdates } from './referenceDataMapper'

export const referenceDataService = (serviceClient: ServiceClient) =>
  serviceClient.createStreamOperation<RawCurrencyPairUpdates>('reference', 'getCurrencyPairUpdatesStream', {}).pipe(
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
    refCount(),
  )
