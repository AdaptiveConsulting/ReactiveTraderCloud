import { Observable } from 'rxjs/Rx'
import { ServiceBase } from '../system/service'
import { logger, RetryPolicy } from '../system'
import '../system/observableExtensions/retryPolicyExt'

const log = logger.create('PricingService')

export default class PricingService extends ServiceBase {
  _schedulerService: any
  getSpotPriceStream(request) {
    const getPriceUpdatesOperationName = 'getPriceUpdates'
    return Observable.create(
      (o) => {
        log.debug(`Subscribing to spot price stream for [${request.symbol}]`)
        let lastPrice = null
        return this._serviceClient
          .createStreamOperation(getPriceUpdatesOperationName, request)
          // we retry the price stream forever, if it errors (likely connection down) we pump a non tradable price
          .retryWithPolicy(
            RetryPolicy.indefiniteEvery2Seconds,
            getPriceUpdatesOperationName,
            this._schedulerService.async,
            (err, willRetry) => {
              if (willRetry && lastPrice !== null) {
                // if we have any error on the price stream we pump a stale price
                // let stalePrice = new SpotPrice(
                //   lastPrice.symbol,
                //   lastPrice.ratePrecision,
                //   lastPrice.bid,
                //   lastPrice.ask,
                //   lastPrice.mid,
                //   lastPrice.valueDate,
                //   lastPrice.creationTimestamp,
                //   lastPrice.priceMovementType,
                //   lastPrice.spread,
                //   false
                // )

                // TODO: stalePrice now is implemented in spottile. Move it back here or remove what's left from here?
                // o.next(false)
              }
            },
          )
          .map(item => keysToLower(item))
          .subscribe(
            (price) => {
              lastPrice = price
              o.next(price)
            },
            (err) => { o.error(err) },
            () => { o.complete() },
          )
      },
    )
  }
}

function keysToLower(object) {
  return {
    ask: object.Ask,
    bid: object.Bid,
    mid: object.Mid,
    creationTimestamp: object.CreationTimestamp,
    symbol: object.Symbol,
    valueDate: object.ValueDate,
  }
}
