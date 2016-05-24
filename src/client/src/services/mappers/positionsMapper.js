import _ from 'lodash';
import { PositionUpdates, CurrencyPairPosition, HistoricPosition } from '../model';
import { ReferenceDataService } from '../';

export default class PositionsMapper {
  _referenceDataService:ReferenceDataService;

  constructor(referenceDataService:ReferenceDataService){
    this._referenceDataService = referenceDataService;
  }

  mapFromDto(dto:Object):PositionUpdates {
    let positions = this._mapPositionsFromDto(dto.CurrentPositions);
    let history = this._mapHistoricPositionFromDto(dto.History);
    return new PositionUpdates(positions, history);
  }

  static mapToDto(ccyPairPosition:CurrencyPairPosition):Object{
    return{
      symbol: ccyPairPosition._symbol,
      basePnl: ccyPairPosition._basePnl,
      baseTradedAmount: ccyPairPosition._baseTradedAmount
    };
  }

  _mapPositionsFromDto(dtos:Array<Object>):Array<CurrencyPairPosition> {
    return _.map(
      dtos,
      dto => new CurrencyPairPosition(
        dto.Symbol,
        dto.BasePnl,
        dto.BaseTradedAmount,
        this._referenceDataService.getCurrencyPair(dto.Symbol))
    );
  }

  _mapHistoricPositionFromDto(dtos:Array<Object>):Array<HistoricPosition> {
    return _.map(
      dtos,
      dto => new HistoricPosition(new Date(dto.Timestamp), dto.UsdPnl)
    );
  }
}
