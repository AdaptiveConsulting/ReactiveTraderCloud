import {
  CurrencyPairPosition,
  HistoricPosition,
  PositionUpdates
} from '../../types'

export interface CurrencyPairPositionRaw {
  Symbol: string
  BasePnl: number
  BaseTradedAmount: number
}

export interface PositionsRaw {
  CurrentPositions: CurrencyPairPositionRaw[]
  History: HistoryRaw[]
}

export interface HistoryRaw {
  Timestamp: string
  UsdPnl: number
}

export default class PositionsMapper {
  constructor() {}

  static mapToDto(ccyPairPosition: CurrencyPairPosition) {
    return {
      symbol: ccyPairPosition.symbol,
      basePnl: ccyPairPosition.basePnl,
      baseTradedAmount: ccyPairPosition.baseTradedAmount
    }
  }

  static mapFromDto(dto: PositionsRaw): PositionUpdates {
    const positions = this.mapPositionsFromDto(dto.CurrentPositions)
    const history = this.mapHistoricPositionFromDto(dto.History)
    return {
      history,
      currentPositions: positions
    }
  }

  static mapPositionsFromDto(
    dtos: CurrencyPairPositionRaw[]
  ): CurrencyPairPosition[] {
    return dtos.map<CurrencyPairPosition>(dto => ({
      symbol: dto.Symbol,
      basePnl: dto.BasePnl,
      baseTradedAmount: dto.BaseTradedAmount,
      basePnlName: 'basePnl',
      baseTradedAmountName: 'baseTradedAmount'
    }))
  }

  static mapHistoricPositionFromDto(dtos: HistoryRaw[]): HistoricPosition[] {
    return dtos.map<HistoricPosition>(dto => ({
      timestamp: new Date(dto.Timestamp),
      usdPnl: dto.UsdPnl
    }))
  }
}
