import { logger } from '../../system';
import { SpotPrice, Rate, CurrencyPair, PriceMovementType, Spread } from '../model';
import { ReferenceDataService } from '../';

export default class PriceMapper {
  _referenceDataService:ReferenceDataService;

  constructor(referenceDataService:ReferenceDataService) {
    this._referenceDataService = referenceDataService;
  }

  mapFromSpotPriceDto(lastPriceDto:Object, nextPriceDto:Object):SpotPrice {
    let currencyPair:CurrencyPair = this._referenceDataService.getCurrencyPair(nextPriceDto.Symbol);
    var bid = new Rate(nextPriceDto.Bid, currencyPair.ratePrecision, currencyPair.pipsPosition);
    var ask = new Rate(nextPriceDto.Ask, currencyPair.ratePrecision, currencyPair.pipsPosition);
    var mid = new Rate(nextPriceDto.Mid, currencyPair.ratePrecision, currencyPair.pipsPosition);
    let spread = this._getSpread(nextPriceDto.Bid, nextPriceDto.Ask, currencyPair);
    let priceMovementType = this._getPriceMovementType(lastPriceDto, nextPriceDto);
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
      true // is tradable
    );
  }

  static mapToSpotPriceDto(spotPrice:SpotPrice):Object{
    return {
      bid: spotPrice.bid.rawRate,
      ask: spotPrice.ask.rawRate,
      symbol: spotPrice.symbol,
      ratePrecision: spotPrice.ratePrecision
    };
  }

  _getPriceMovementType(lastPriceDto:Object, nextPriceDto:Object) {
    if(lastPriceDto === null) {
      return PriceMovementType.None;
    }
    if(lastPriceDto.Mid < nextPriceDto.Mid) {
      return PriceMovementType.Up;
    }
    if(lastPriceDto.Mid > nextPriceDto.Mid) {
      return PriceMovementType.Down;
    }
    return PriceMovementType.None;
  }

  _getSpread(bid:number, ask:number, currencyPair:CurrencyPair) {
    let spread = (ask - bid) * Math.pow(10, currencyPair.pipsPosition);
    let toFixedPrecision = spread.toFixed(currencyPair.ratePrecision - currencyPair.pipsPosition);
    return new Spread(Number(toFixedPrecision), toFixedPrecision);
  }
}
