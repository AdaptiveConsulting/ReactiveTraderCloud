import { asyncScheduler, Observable } from 'rxjs'
import { map, share } from 'rxjs/operators'
import { logger, RetryPolicy } from '../system'
import { retryWithPolicy } from '../system/observableExtensions/retryPolicyExt'
import { ServiceClient } from '../system/service'
import { ServiceConst, SpotPriceTick } from '../types'

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
        asyncScheduler
      ),
      map(adaptDTO),
      share()
    )
}

export default class PricingService {
  private readonly cachedSpotStreamBySymbol = new Map<
    string,
    Observable<SpotPriceTick>
  >()
  constructor(private readonly serviceClient: ServiceClient) {}

  getSpotPriceStream(request: Request) {
    const { symbol } = request
    if (!this.cachedSpotStreamBySymbol.has(symbol)) {
      this.cachedSpotStreamBySymbol.set(
        symbol,
        createSpotPriceStream(this.serviceClient, request)
      )
    }
    return this.cachedSpotStreamBySymbol.get(symbol)!
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
