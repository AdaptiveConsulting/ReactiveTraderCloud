import { Observable } from 'rxjs'
import { map, retryWhen, scan, share } from 'rxjs/operators'
import { logger, retryConstantly, ServiceClient } from '../system'
import { debounceWithSelector } from '../system/debounceOnMissedHeartbeat'
import { PriceMovementTypes, ServiceConst, SpotPriceTick } from '../types'

const log = logger.create('PricingService')
const getPriceUpdatesOperationName = 'getPriceUpdates'

interface Request {
  symbol: string
}

const MS_FOR_LAST_PRICE_TO_BECOME_STALE = 6000

export default class PricingService {
  private readonly cachedSpotStreamBySymbol = new Map<string, Observable<SpotPriceTick>>()

  constructor(private readonly serviceClient: ServiceClient) {}

  private static getPriceMovementType(prevItem: SpotPriceTick, newItem: SpotPriceTick) {
    const prevPriceMove = prevItem.priceMovementType || PriceMovementTypes.None
    const lastPrice = prevItem.mid
    const nextPrice = newItem.mid
    if (lastPrice < nextPrice) {
      return PriceMovementTypes.Up
    }
    if (lastPrice > nextPrice) {
      return PriceMovementTypes.Down
    }
    return prevPriceMove
  }

  private static createSpotPriceStream = (serviceClient: ServiceClient, request: Request) => {
    log.debug(`Subscribing to spot price stream for [${request.symbol}]`)
    return serviceClient
      .createStreamOperation<RawPrice, Request>(ServiceConst.PricingServiceKey, getPriceUpdatesOperationName, request)
      .pipe(
        retryWhen(
          retryConstantly({
            interval: 2000
          })
        ),
        map(adaptDTO),
        scan<SpotPriceTick>((acc, next) => {
          next.priceMovementType = PricingService.getPriceMovementType(acc, next)
          return next
        }),
        debounceWithSelector<SpotPriceTick>(MS_FOR_LAST_PRICE_TO_BECOME_STALE, item => ({
          ...item,
          priceStale: true
        })),
        share()
      )
  }

  getSpotPriceStream(request: Request) {
    const { symbol } = request
    if (!this.cachedSpotStreamBySymbol.has(symbol)) {
      this.cachedSpotStreamBySymbol.set(symbol, PricingService.createSpotPriceStream(this.serviceClient, request))
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
