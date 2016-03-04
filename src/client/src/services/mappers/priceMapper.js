import { SpotPrice, Rate, CurrencyPair, PriceMovementType } from '../model';
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

  _getPriceMovementType(lastPriceDto:Object, nextPriceDto:Object) {
    if(lastPriceDto === null) {
      return PriceMovementType.None;
    }
    if(lastPriceDto.Mid < nextPriceDto.Mid) {
      return PriceMovementType.Up;
    }
    if(lastPriceDto.Mid.rawRate > nextPriceDto.Mid) {
      return PriceMovementType.Down;
    }
    return PriceMovementType.None;
  }

  _getSpread(bid:Number, ask:Number, currencyPair:CurrencyPair) {
    let spread = (bid - ask) * Math.pow(10, currencyPair.pipsPosition);
    var toFixedPrecision = spread.toFixed(currencyPair.ratePrecision - currencyPair.pipsPosition);
    return Number(toFixedPrecision);
  }
}
