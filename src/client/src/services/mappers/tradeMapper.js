import _ from 'lodash';
import { Trade, Direction, TradeStatus } from '../model';
import { ReferenceDataService } from '../';

export default class TradeMapper {
  _referenceDataService:ReferenceDataService;

  constructor(referenceDataService:ReferenceDataService) {
    this._referenceDataService = referenceDataService;
  }

  mapFromDto(dto:Object) : Array<Trade> {
    return _.map(
      dto.Trades,
      trade => this.mapFromTradeDto(trade, dto.IsStateOfTheWorld));
  }

  mapFromTradeDto(tradeDto:Object, isStateOfTheWorld:boolean) : Trade {
    let direction = this._mapDirectionFromDto(tradeDto.Direction);
    let status = this._mapTradeStatusFromDto(tradeDto.Status);
    let currencyPair = this._referenceDataService.getCurrencyPair(tradeDto.CurrencyPair);
    return new Trade(
      tradeDto.TradeId,
      tradeDto.TraderName,
      currencyPair,
      tradeDto.Notional,
      tradeDto.DealtCurrency,
      direction,
      tradeDto.SpotRate,
      new Date(tradeDto.TradeDate),
      new Date(tradeDto.ValueDate),
      status,
      isStateOfTheWorld
    );
  }

  _mapDirectionFromDto(directionDto:string) {
    switch (directionDto) {
      case Direction.Buy.name:
        return Direction.Buy;
      case Direction.Sell.name:
        return Direction.Sell;
      default:
        throw new Error(`Unknown direction ${directionDto}`);
    }
  }

  _mapTradeStatusFromDto(statusDto:string) {
    switch (statusDto) {
      case TradeStatus.Pending.name:
        return TradeStatus.Pending;
      case TradeStatus.Done.name:
        return TradeStatus.Done;
      case TradeStatus.Rejected.name:
        return TradeStatus.Rejected;
      default:
        throw new Error(`Unknown trade status ${statusDto}`);
    }
  }
}
