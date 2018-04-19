import * as _ from 'lodash'

import {
  CurrencyPairPosition,
  HistoricPosition,
  PositionUpdates,
  ReferenceDataService
} from '../../types'

export default class PositionsMapper {
  referenceDataService: ReferenceDataService

  constructor(referenceDataService: ReferenceDataService) {
    this.referenceDataService = referenceDataService
  }

  static mapToDto(ccyPairPosition: CurrencyPairPosition) {
    return {
      symbol: ccyPairPosition.symbol,
      basePnl: ccyPairPosition.basePnl,
      baseTradedAmount: ccyPairPosition.baseTradedAmount
    }
  }

  mapFromDto(dto: any): PositionUpdates {
    const positions = this.mapPositionsFromDto(dto.CurrentPositions)
    const history = this.mapHistoricPositionFromDto(dto.History)
    return {
      history,
      currentPositions: positions
    }
  }

  mapPositionsFromDto(dtos: any[]): CurrencyPairPosition[] {
    return _.map(dtos, (dto): CurrencyPairPosition => ({
      symbol: dto.Symbol,
      basePnl: dto.BasePnl,
      baseTradedAmount: dto.BaseTradedAmount,
      basePnlName: 'basePnl',
      baseTradedAmountName: 'baseTradedAmount'
    }))
  }

  mapHistoricPositionFromDto(dtos: any[]): HistoricPosition[] {
    return _.map(dtos, (dto): HistoricPosition => ({
      timestamp: new Date(dto.Timestamp),
      usdPnl: dto.UsdPnl
    }))
  }
}
