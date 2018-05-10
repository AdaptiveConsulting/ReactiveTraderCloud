import { map, shareReplay } from 'rxjs/operators'
import { ServiceClient } from '../system/service'
import { CurrencyPair, CurrencyPairUpdates, UpdateType } from '../types'
import { referenceDataMapper } from './mappers'
import { RawCurrencyPairUpdates } from './mappers/referenceDataMapper'

type CurrencyPairCache = (update: CurrencyPairUpdates) => void

const getReferenceDataStream = (
  serviceClient: ServiceClient,
  updCache: CurrencyPairCache
) => {
  const refStream = serviceClient
    .createStreamOperation<RawCurrencyPairUpdates>(
      'getCurrencyPairUpdatesStream',
      {}
    )
    .pipe(map(referenceDataMapper.mapCurrencyPairsFromDto), shareReplay())

  refStream.subscribe(updates => updCache(updates))

  return refStream
}

const updateCache = (currencyPairCache: CCYCache) => (
  update: CurrencyPairUpdates
) => {
  const pairUpdates = update.currencyPairUpdates

  pairUpdates.forEach(currencyPairUpdate => {
    if (currencyPairUpdate.updateType === UpdateType.Added) {
      currencyPairCache.ccyPairs.set(
        currencyPairUpdate.currencyPair.symbol,
        currencyPairUpdate.currencyPair
      )
    } else {
      currencyPairCache.ccyPairs.delete(currencyPairUpdate.currencyPair.symbol)
    }
  })
  if (!currencyPairCache.hasLoaded && update.currencyPairUpdates.length > 0) {
    currencyPairCache.hasLoaded = true
  }
}

interface CCYCache {
  hasLoaded: boolean
  ccyPairs: Map<string, CurrencyPair>
}

export default class ReferenceDataService {
  private readonly referenceDataStreamConnectable
  private readonly currencyPairCache: CCYCache = {
    hasLoaded: false,
    ccyPairs: new Map()
  }

  constructor(private readonly serviceClient: ServiceClient) {
    this.referenceDataStreamConnectable = getReferenceDataStream(
      serviceClient,
      updateCache(this.currencyPairCache)
    )
  }

  getCurrencyPair(symbol: string) {
    if (!this.currencyPairCache.hasLoaded) {
      throw new Error(`Reference data cache hasn't finished loading`)
    }

    if (this.currencyPairCache.ccyPairs.has(symbol)) {
      return this.currencyPairCache.ccyPairs.get(symbol)!
    } else {
      throw new Error(
        `CurrencyPair with symbol [${symbol}] is not in the cache.`
      )
    }
  }
  getCurrencyPairUpdatesStream() {
    return this.referenceDataStreamConnectable
  }
}
