import * as _ from 'lodash'

import { ReferenceDataService } from '../'
import { CurrencyPairPosition, HistoricPosition, PositionUpdates } from '../../types'

export default class PositionsMapper {

  _referenceDataService: ReferenceDataService

  constructor(referenceDataService: ReferenceDataService) {
    this._referenceDataService = referenceDataService
  }

  static mapToDto(ccyPairPosition: CurrencyPairPosition) {
    return {
      symbol: ccyPairPosition.symbol,
      basePnl: ccyPairPosition.basePnl,
      baseTradedAmount: ccyPairPosition.baseTradedAmount,
    }
  }

  mapFromDto(dto: any): PositionUpdates {
    const positions = this._mapPositionsFromDto(dto.CurrentPositions)
    const history = this._mapHistoricPositionFromDto(dto.History)
    return {
      history,
      currentPositions: positions,
    }
  }

  _mapPositionsFromDto(dtos: Array<any>): Array<CurrencyPairPosition> {
    return _.map(
      dtos,
      (dto): CurrencyPairPosition => ({
        symbol: dto.Symbol,
        basePnl: dto.BasePnl,
        baseTradedAmount: dto.BaseTradedAmount,
        currencyPair: this._referenceDataService.getCurrencyPair(dto.Symbol),
        basePnlName: 'basePnl',
        baseTradedAmountName: 'baseTradedAmount',
      }),
    )
  }

  _mapHistoricPositionFromDto(dtos: Array<any>): Array<HistoricPosition> {
    return _.map(
      dtos,
      (dto): HistoricPosition => ({
        timestamp: new Date(dto.Timestamp),
        usdPnl: dto.UsdPnl,
      }),
    )
  }
}
