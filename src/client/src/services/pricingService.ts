import { Observable, Scheduler } from 'rxjs/Rx'
import { ServiceClient } from '../system/service'
import { ServiceConst } from '../types'
import { logger, RetryPolicy } from '../system'
import '../system/observableExtensions/retryPolicyExt'

const log = logger.create('PricingService')

export default function createPricingService(connection) {
  const serviceClient = new ServiceClient(
    ServiceConst.PricingServiceKey,
    connection
  )
  serviceClient.connect()
  return {
    get serviceStatusStream() {
      return serviceClient.serviceStatusStream
    },
    getSpotPriceStream(request) {
      const getPriceUpdatesOperationName = 'getPriceUpdates'
      return Observable.create(o => {
        log.debug(`Subscribing to spot price stream for [${request.symbol}]`)
        let lastPrice = null
        return (
          serviceClient
            .createStreamOperation(getPriceUpdatesOperationName, request)
            // we retry the price stream forever, if it errors (likely connection down) we pump a non tradable price
            .retryWithPolicy(
              RetryPolicy.indefiniteEvery2Seconds,
              getPriceUpdatesOperationName,
              Scheduler.async,
              (err, willRetry) => {
                if (willRetry && lastPrice !== null) {
                  // TODO: remove is stale price fully supported
                }
              }
            )
            .map(item => keysToLower(item))
            .subscribe(
              price => {
                lastPrice = price
                o.next(price)
              },
              err => {
                o.error(err)
              },
              () => {
                o.complete()
              }
            )
        )
      })
    }
  }
}

function keysToLower(object) {
  return {
    ask: object.Ask,
    bid: object.Bid,
    mid: object.Mid,
    creationTimestamp: object.CreationTimestamp,
    symbol: object.Symbol,
    valueDate: object.ValueDate
  }
}
