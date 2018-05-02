import {
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
  return new Observable<CurrencyPairUpdates>(o => {
    log.debug('Subscribing reference data stream')

    const updateCacheObserver: Observer<CurrencyPairUpdates> = {
      next: updates => {
        // note : we have a side effect here.
        // In this instance it's ok as this stream is published and ref counted, i.e. there is only ever 1
        // and this services is designed to be run at startup and other calls should block until it's loaded.
        // The intent here is all reference data should be exposed via both a synchronous and push API.
        // Push only (i.e. Observable only) APIs within applications for data that is effectively already known are a pain to work with.
        updCache(updates)
        o.next(updates)
      },
      error: err => o.error(err),
      complete: () => o.complete()
    }
    return serviceClient
      .createStreamOperation<RawCurrencyPairUpdates, {}>(
        'getCurrencyPairUpdatesStream',
        {}
      )
      .pipe(
        retryWithPolicy(
          RetryPolicy.backoffTo10SecondsMax,
          'getCurrencyPairUpdatesStream',
          Scheduler.async
        ),
        map(referenceDataMapper.mapCurrencyPairsFromDto)
      )
      .subscribe(updateCacheObserver)
  }).pipe(publish()) as ConnectableObservable<CurrencyPairUpdates>
}

const updateCache = (currencyPairCache: { hasLoaded: boolean }) => (
  update: CurrencyPairUpdates
) => {
  const pairUpdates = update.currencyPairUpdates
  pairUpdates.forEach(currencyPairUpdate => {
    if (currencyPairUpdate.updateType === UpdateType.Added) {
      currencyPairCache[currencyPairUpdate.currencyPair.symbol] =
        currencyPairUpdate.currencyPair
    } else if (currencyPairUpdate.updateType === UpdateType.Removed) {
      delete currencyPairCache[currencyPairUpdate.currencyPair.symbol]
    }
  })
  if (!currencyPairCache.hasLoaded && update.currencyPairUpdates.length > 0) {
    currencyPairCache.hasLoaded = true
  }
}

export default function referenceDataService(
  connection: Connection
): ReferenceDataService {
  const serviceClient = new ServiceClient(
    ServiceConst.ReferenceServiceKey,
    connection
  )
  const disposables = new Subscription()
  const currencyPairCache = {
    hasLoaded: false
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
      } else if (!currencyPairCache.hasOwnProperty(symbol)) {
        throw new Error(
          `CurrencyPair with symbol [${symbol}] is not in the cache.`
        )
      }
      return currencyPairCache[symbol]
    },
    getCurrencyPairUpdatesStream() {
      return referenceDataStreamConnectable
    }
  }
}
