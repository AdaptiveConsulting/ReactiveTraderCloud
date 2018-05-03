import { Observable, Scheduler } from 'rxjs'
import { map, share } from 'rxjs/operators'
import { logger, RetryPolicy } from '../system'
import { retryWithPolicy } from '../system/observableExtensions/retryPolicyExt'
import { ServiceClient } from '../system/service'
import { ServiceConst, SpotPriceTick } from '../types'
import { Connection } from './../system/service/connection'

const log = logger.create('PricingService')
const getPriceUpdatesOperationName = 'getPriceUpdates'

interface Request {
  symbol: string
}

const createSpotPriceStream = (
  serviceClient: ServiceClient,
  request: Request
) => {
  log.debug(`Subscribing to spot price stream for [${request.symbol}]`)
  return serviceClient
    .createStreamOperation<RawPrice, Request>(
      getPriceUpdatesOperationName,
      request
    )
    .pipe(
      retryWithPolicy(
        RetryPolicy.indefiniteEvery2Seconds,
        getPriceUpdatesOperationName,
        Scheduler.async
      ),
      map(adaptDTO),
      share()
    )
}

export default function createPricingService(connection: Connection) {
  const cachedSpotStreamBySymbol = new Map<string, Observable<SpotPriceTick>>()

  const serviceClient = new ServiceClient(
    ServiceConst.PricingServiceKey,
    connection
  )
  serviceClient.connect()
  return {
    get serviceStatusStream() {
      return serviceClient.serviceStatusStream
    },
    getSpotPriceStream(request: Request) {
      const { symbol } = request
      if (!cachedSpotStreamBySymbol.has(symbol)) {
        cachedSpotStreamBySymbol.set(
          symbol,
          createSpotPriceStream(serviceClient, request)
        )
      }
      return cachedSpotStreamBySymbol.get(symbol)!
    }
  }
}

interface RawPrice {
  Ask: number
  Bid: number
  Mid: number
  CreationTimestamp: number
  Symbol: string
  ValueDate: string
}

function adaptDTO(dto: RawPrice): SpotPriceTick {
  return {
    ask: dto.Ask,
    bid: dto.Bid,
    mid: dto.Mid,
    creationTimestamp: dto.CreationTimestamp,
    symbol: dto.Symbol,
    valueDate: dto.ValueDate
  }
}
