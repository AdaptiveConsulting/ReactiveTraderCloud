import _ from 'lodash';
import { Trade } from '../model';

export default class TradeMapper {
  mapFromDtoArray(dtos:Array<Object>) : Array<Trade> {
    let trades = _(dtos)
      .map(dto => this.mapFromDto(dto))
      .value();
    return trades;
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
