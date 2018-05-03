import {
  asyncScheduler,
  ConnectableObservable,
  Observable,
  Observer,
  Scheduler,
  Subscription
} from 'rxjs'
import { filter, map, publish } from 'rxjs/operators'
import { logger, RetryPolicy } from '../system'
import { retryWithPolicy } from '../system/observableExtensions/retryPolicyExt'
import { ServiceClient } from '../system/service'
import { Connection } from '../system/service/connection'
import {
  ConnectionStatus,
  CurrencyPair,
  CurrencyPairUpdates,
  ReferenceDataService,
  ServiceConst,
  UpdateType
} from '../types'
import { referenceDataMapper } from './mappers'
import { RawCurrencyPairUpdates } from './mappers/referenceDataMapper'

type CurrencyPairCache = (update: CurrencyPairUpdates) => void

const log = logger.create('ReferenceDataService')

const getReferenceDataStream = (
  serviceClient: ServiceClient,
  updCache: CurrencyPairCache
) => {
  const refStream = serviceClient
    .createStreamOperation<RawCurrencyPairUpdates>(
      'getCurrencyPairUpdatesStream',
      {}
    )
    .pipe(
      retryWithPolicy(
        RetryPolicy.backoffTo10SecondsMax,
        'getCurrencyPairUpdatesStream',
        asyncScheduler
      ),
      map(referenceDataMapper.mapCurrencyPairsFromDto),
      publish<CurrencyPairUpdates>()
    )

  refStream.subscribe(updates => updCache(updates))

  return refStream as ConnectableObservable<CurrencyPairUpdates>
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

export default function referenceDataService(
  connection: Connection
): ReferenceDataService {
  const serviceClient = new ServiceClient(
    ServiceConst.ReferenceServiceKey,
    connection
  )
  const disposables = new Subscription()

  const currencyPairCache: CCYCache = {
    hasLoaded: false,
    ccyPairs: new Map()
  }

  const referenceDataStreamConnectable = getReferenceDataStream(
    serviceClient,
    updateCache(currencyPairCache)
  )

  // on connection/reconnection get reference data stream
  const connectToReferenceStream = () => {
    serviceClient.isConnectCalled = false
    disposables.add(referenceDataStreamConnectable.connect())
  }
  connection.connectionStatusStream
    .pipe(
      filter(
        connectionStatus => connectionStatus === ConnectionStatus.connected
      )
    )
    .subscribe(connectToReferenceStream)

  serviceClient.connect()

  return {
    get serviceStatusStream() {
      return serviceClient.serviceStatusStream
    },
    getCurrencyPair(symbol: string) {
      if (!currencyPairCache.hasLoaded) {
        throw new Error(`Reference data cache hasn't finished loading`)
      }

      if (currencyPairCache.ccyPairs.has(symbol)) {
        return currencyPairCache.ccyPairs.get(symbol)!
      } else {
        throw new Error(
          `CurrencyPair with symbol [${symbol}] is not in the cache.`
        )
      }
    },
    getCurrencyPairUpdatesStream() {
      return referenceDataStreamConnectable
    }
  }
}
