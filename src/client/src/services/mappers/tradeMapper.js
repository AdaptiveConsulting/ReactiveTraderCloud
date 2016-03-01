import _ from 'lodash';
import { Trade } from '../model';

export default class TradeMapper {
  mapFromDtoArray(dtos:Array<Object>) : Array<Trade> {
    return _.map(
      dtos,
      dto => this.mapFromDto(dto)
    );
  }
  mapFromDto(tradeDto:Object) : Trade {
    return new Trade(
      tradeDto.TradeId,
      tradeDto.TraderName,
      tradeDto.CurrencyPair,
      tradeDto.Notional,
      tradeDto.DealtCurrency,
      tradeDto.Direction,
      tradeDto.SpotRate,
      new Date(tradeDto.TradeDate),
      tradeDto.ValueDate,
      tradeDto.Status
    );
  }
}
