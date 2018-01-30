import * as _ from 'lodash'
import { Observable, Scheduler, Subscription } from 'rxjs/Rx'
import { ReferenceDataMapper } from './mappers'
import { ConnectionStatus, UpdateType, ServiceConst } from '../types'
import { logger, RetryPolicy } from '../system'
import { ServiceClient } from '../system/service'
import '../system/observableExtensions/retryPolicyExt'
const log = logger.create('ReferenceDataService')

export default function referenceDataService(connection): Object {
  const serviceClient = new ServiceClient(
    ServiceConst.ReferenceServiceKey,
    connection
  )
  const disposables = new Subscription()
  const referenceDataMapper = new ReferenceDataMapper()
  const updateCache = update => {
    const pairUpdates = update.currencyPairUpdates
    _.forEach(pairUpdates, currencyPairUpdate => {
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
  const referenceDataStream = () => {
    return Observable.create(o => {
      log.debug('Subscribing reference data stream')
      return serviceClient
        .createStreamOperation('getCurrencyPairUpdatesStream', {})
        .retryWithPolicy(
          RetryPolicy.backoffTo10SecondsMax,
          'getCurrencyPairUpdatesStream',
          Scheduler.async
        )
        .map(data => referenceDataMapper.mapCurrencyPairsFromDto(data))
        .subscribe(
          updates => {
            // note : we have a side effect here.
            // In this instance it's ok as this stream is published and ref counted, i.e. there is only ever 1
            // and this services is designed to be run at startup and other calls should block until it's loaded.
            // The intent here is all reference data should be exposed via both a synchronous and push API.
            // Push only (i.e. Observable only) APIs within applications for data that is effectively already known are a pain to work with.
            updateCache(updates)
            o.next(updates)
          },
          err => {
            o.error(err)
          },
          () => {
            o.complete()
          }
        )
    })
  }
  const referenceDataStreamConnectable = referenceDataStream().publish()
  const currencyPairCache = {
    hasLoaded: false
  }

  // on connection/reconnection get reference data stream
  connection.connectionStatusStream
    .filter(el => el === ConnectionStatus.connected)
    .subscribe(() => {
      // TEMP force refdata reconnecting
      serviceClient.isConnectCalled = false
      referenceDataStreamConnectable.connection = null

      disposables.add(referenceDataStreamConnectable.connect())
    })
  serviceClient.connect()

  return {
    get serviceStatusStream() {
      return serviceClient.serviceStatusStream
    },
    getCurrencyPair(symbol) {
      if (!currencyPairCache.hasLoaded) {
        throw new Error(`Reference data cache hasn't finished loading`)
      }
      if (!currencyPairCache.hasOwnProperty(symbol)) {
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
