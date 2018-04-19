import * as _ from 'lodash'
import { Observable, Scheduler, Subscription } from 'rxjs/Rx'
import { logger, RetryPolicy } from '../system'
import '../system/observableExtensions/retryPolicyExt'
import { ServiceClient } from '../system/service'
import { ConnectionStatus, ServiceConst, UpdateType } from '../types'
import { referenceDataMapper } from './mappers'

const log = logger.create('ReferenceDataService')

const getReferenceDataStream = (serviceClient, updCache) => {
  const retryWithPolicyArgs = [RetryPolicy.backoffTo10SecondsMax, 'getCurrencyPairUpdatesStream', Scheduler.async]
  return Observable.create(o => {
    log.debug('Subscribing reference data stream')
    const updateCacheObserver = {
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
      .createStreamOperation('getCurrencyPairUpdatesStream', {})
      .retryWithPolicy(...retryWithPolicyArgs)
      .map(referenceDataMapper.mapCurrencyPairsFromDto)
      .subscribe(updateCacheObserver)
  }).publish()
}

const isConnected = () => connectionStatus => connectionStatus === ConnectionStatus.connected

const updateCache = (currencyPairCache) => update => {
  const pairUpdates = update.currencyPairUpdates
  _.forEach(pairUpdates, currencyPairUpdate => {
    if (currencyPairUpdate.updateType === UpdateType.Added) {
      currencyPairCache[currencyPairUpdate.currencyPair.symbol] = currencyPairUpdate.currencyPair
    } else if (currencyPairUpdate.updateType === UpdateType.Removed) {
      delete currencyPairCache[currencyPairUpdate.currencyPair.symbol]
    }
  })
  if (!currencyPairCache.hasLoaded && update.currencyPairUpdates.length > 0) {
    currencyPairCache.hasLoaded = true
  }
}

export default function referenceDataService(connection): Object {
  const serviceClient = new ServiceClient(ServiceConst.ReferenceServiceKey, connection)
  const disposables = new Subscription()
  const currencyPairCache = {
    hasLoaded: false
  }
  const referenceDataStreamConnectable = getReferenceDataStream(serviceClient, updateCache(currencyPairCache))

  // on connection/reconnection get reference data stream
  const connectToReferenceStream = () => {
    // TEMP force refdata reconnecting
    serviceClient.isConnectCalled = false
    referenceDataStreamConnectable.connection = null
    disposables.add(referenceDataStreamConnectable.connect())
  }
  connection.connectionStatusStream
    .filter(isConnected)
    .subscribe(connectToReferenceStream)

  serviceClient.connect()

  return {
    get serviceStatusStream() {
      return serviceClient.serviceStatusStream
    },
    getCurrencyPair(symbol) {
      if (!currencyPairCache.hasLoaded) {
        throw new Error(`Reference data cache hasn't finished loading`)
      } else if (!currencyPairCache.hasOwnProperty(symbol)) {
        throw new Error(`CurrencyPair with symbol [${symbol}] is not in the cache.`)
      }
      return currencyPairCache[symbol]
    },
    getCurrencyPairUpdatesStream() {
      return referenceDataStreamConnectable
    }
  }
}
