import Rate from '../model/rate'
import SpotPrice from '../model/spotPrice'
import Spread from '../model/spread'
import CurrencyPair from '../model/currencyPair'
import ReferenceDataService from '../referenceDataService'
import { PriceMovementType } from '../model'

export default class PriceMapper {
  _referenceDataService: ReferenceDataService

  constructor(referenceDataService: ReferenceDataService) {
    this._referenceDataService = referenceDataService
  }

  static mapToSpotPriceDto(spotPrice: SpotPrice): Object {
    return {
      bid: spotPrice.bid.rawRate,
      ask: spotPrice.ask.rawRate,
      symbol: spotPrice.symbol,
      ratePrecision: spotPrice.ratePrecision,
    }
  }

  mapFromSpotPriceDto(lastPriceDto: any, nextPriceDto: any): SpotPrice {
    const currencyPair: CurrencyPair = this._referenceDataService.getCurrencyPair(nextPriceDto.Symbol)
    let bid = new Rate(nextPriceDto.Bid, currencyPair.ratePrecision, currencyPair.pipsPosition)
    let ask = new Rate(nextPriceDto.Ask, currencyPair.ratePrecision, currencyPair.pipsPosition)
    let mid = new Rate(nextPriceDto.Mid, currencyPair.ratePrecision, currencyPair.pipsPosition)
    const spread = this._getSpread(nextPriceDto.Bid, nextPriceDto.Ask, currencyPair)
    const priceMovementType = this._getPriceMovementType(lastPriceDto, nextPriceDto)
    return new SpotPrice(
      nextPriceDto.Symbol,
      currencyPair.ratePrecision,
      bid,
      ask,
      mid,
      nextPriceDto.ValueDate,
      nextPriceDto.CreationTimestamp,
      priceMovementType,
      spread,
      true, // is tradable
    )
  }

  _getPriceMovementType(lastPriceDto: any, nextPriceDto: any) {
    if (lastPriceDto === null) {
      return PriceMovementType.None
    }
    if (lastPriceDto.Mid < nextPriceDto.Mid) {
      return PriceMovementType.Up
    }
    if (lastPriceDto.Mid > nextPriceDto.Mid) {
      return PriceMovementType.Down
    }
    return PriceMovementType.None
  }

  _getSpread(bid: number, ask: number, currencyPair: CurrencyPair) {
    const spread = (ask - bid) * Math.pow(10, currencyPair.pipsPosition)
    const toFixedPrecision = spread.toFixed(currencyPair.ratePrecision - currencyPair.pipsPosition)
    return new Spread(Number(toFixedPrecision), toFixedPrecision)
  }
}
