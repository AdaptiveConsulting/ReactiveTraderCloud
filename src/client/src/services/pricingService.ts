import { Observable, Scheduler } from 'rxjs/Rx'
import { ServiceClient } from '../system/service'
import { ServiceConst } from '../types'
import { logger, RetryPolicy } from '../system'
import '../system/observableExtensions/retryPolicyExt'

const log = logger.create('PricingService')

interface Request {
  symbol: string,
}

export default function createPricingService(connection) {
  const getPriceUpdatesOperationName = 'getPriceUpdates'
  const cachedObservablesBySymbol = {}
  const serviceClient = new ServiceClient(
    ServiceConst.PricingServiceKey,
    connection
  )
  const createSpotPriceStream = (request: Request) => {
    const observable = Observable.create(clientObserver => {
      log.debug(`Subscribing to spot price stream for [${request.symbol}]`)
      let lastPrice = null
      const innerObserver = {
        next: price => {
          lastPrice = price
          clientObserver.next(price)
        },
        error: err => {
          clientObserver.error(err)
        },
        complete: () => {
          clientObserver.complete()
        }
      }
      const retryWithPolicyErrorCb = (err, willRetry) => {
        if (willRetry && lastPrice !== null) {
          // TODO: remove is stale price fully supported
        }
      }
      const retryWithPolicyArgs = [
        RetryPolicy.indefiniteEvery2Seconds,
        getPriceUpdatesOperationName,
        Scheduler.async,
        retryWithPolicyErrorCb,
      ]
      const subscription = serviceClient
        .createStreamOperation(getPriceUpdatesOperationName, request)
        // we retry the price stream forever, if it errors (likely connection down) we pump a non tradable price
        .retryWithPolicy(...retryWithPolicyArgs)
        .map(adaptDTO)
        .subscribe(innerObserver)
      return subscription
    })
    return observable.share()
  }
  serviceClient.connect()
  return {
    get serviceStatusStream() {
      return serviceClient.serviceStatusStream
    },
    getSpotPriceStream(request:Request) {
      const { symbol } = request
      if (!cachedObservablesBySymbol[symbol]) {
        cachedObservablesBySymbol[symbol] = createSpotPriceStream(request)
      }
      return cachedObservablesBySymbol[symbol]
    }
  }
}

function adaptDTO(object) {
  return {
    ask: object.Ask,
    bid: object.Bid,
    mid: object.Mid,
    creationTimestamp: object.CreationTimestamp,
    symbol: object.Symbol,
    valueDate: object.ValueDate
  }
}
