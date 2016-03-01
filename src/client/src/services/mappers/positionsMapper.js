import _ from 'lodash';
import { AnalyticsRequest, PositionUpdates, CurrencyPairPosition, HistoricPosition } from '../model';

export default class PositionsMapper {

  mapFromDto(dto:Object):PositionUpdates {
    let positions = this._mapPositionsFromDto(dto.CurrentPositions);
    let history = this._mapHistoricPositionFromDto(dto.History);
    return new PositionUpdates(positions, history);
  }

  _mapPositionsFromDto(dtos:Array<Object>):Array<CurrencyPairPosition> {
    return _.map(
      dtos,
      dto => new CurrencyPairPosition(
        dto.Symbol,
        dto.BasePnl,
        dto.BaseTradedAmount)
    );
  }

  _mapHistoricPositionFromDto(dtos:Array<Object>):Array<HistoricPosition> {
    return _.map(
      dtos,
      dto => new HistoricPosition(new Date(dto.Timestamp), dto.UsdPnl)
    );
  }
}
