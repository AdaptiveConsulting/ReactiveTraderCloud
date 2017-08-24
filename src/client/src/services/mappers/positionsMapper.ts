import * as _ from 'lodash';

import { ReferenceDataService } from '../';
import PositionUpdates from '../model/positionUpdates';
import CurrencyPairPosition from '../model/currencyPairPosition';
import HistoricPosition from '../model/historicPosition';

export default class PositionsMapper {

  _referenceDataService: ReferenceDataService;

  constructor(referenceDataService: ReferenceDataService) {
    this._referenceDataService = referenceDataService;
  }

  static mapToDto(ccyPairPosition: CurrencyPairPosition) {
    return {
      symbol: ccyPairPosition._symbol,
      basePnl: ccyPairPosition._basePnl,
      baseTradedAmount: ccyPairPosition._baseTradedAmount
    };
  }

  mapFromDto(dto: any): PositionUpdates {
    let positions = this._mapPositionsFromDto(dto.CurrentPositions);
    let history = this._mapHistoricPositionFromDto(dto.History);
    return new PositionUpdates(positions, history);
  }

  _mapPositionsFromDto(dtos: Array<any>): Array<CurrencyPairPosition> {
    return _.map(
      dtos,
      dto => new CurrencyPairPosition(
        dto.Symbol,
        dto.BasePnl,
        dto.BaseTradedAmount,
        this._referenceDataService.getCurrencyPair(dto.Symbol))
    );
  }

  _mapHistoricPositionFromDto(dtos: Array<any>): Array<HistoricPosition> {
    return _.map(
      dtos,
      dto => new HistoricPosition(new Date(dto.Timestamp), dto.UsdPnl)
    );
  }
}
