import { Observable, Scheduler } from 'rxjs/Rx'
import { logger, RetryPolicy } from '../system'
import '../system/observableExtensions/retryPolicyExt'
import { ServiceClient } from '../system/service'
import { ServiceConst } from '../types'

const log = logger.create('PricingService')
const getPriceUpdatesOperationName = 'getPriceUpdates'

interface Request {
  symbol: string,
}

const createSpotPriceStream = (serviceClient, request: Request) => {
  const observable = Observable.create(clientObserver => {
    log.debug(`Subscribing to spot price stream for [${request.symbol}]`)
    let lastPrice = null
    const innerObserver = {
      next(price) {
        lastPrice = price
        clientObserver.next(price)
      },
      error(err) {
        clientObserver.error(err)
      },
      complete() {
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

export default function createPricingService(connection) {
  const cachedSpotStreamBySymbol = {}
  const serviceClient = new ServiceClient(ServiceConst.PricingServiceKey, connection)
  serviceClient.connect()
  return {
    get serviceStatusStream() {
      return serviceClient.serviceStatusStream
    },
    getSpotPriceStream(request: Request) {
      const { symbol } = request
      if (!cachedSpotStreamBySymbol[symbol]) {
        cachedSpotStreamBySymbol[symbol] = createSpotPriceStream(serviceClient, request)
      }
      return cachedSpotStreamBySymbol[symbol]
    }
  }
}

function adaptDTO(dto) {
  return {
    ask: dto.Ask,
    bid: dto.Bid,
    mid: dto.Mid,
    creationTimestamp: dto.CreationTimestamp,
    symbol: dto.Symbol,
    valueDate: dto.ValueDate
  }
}
