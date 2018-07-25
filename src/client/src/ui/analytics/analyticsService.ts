import { map, retryWhen } from 'rxjs/operators'
import { retryConstantly, ServiceClient } from '../../system'
import {
  CurrencyPairPosition,
  CurrencyPairPositionRaw,
  HistoricPosition,
  HistoryRaw,
  PositionsRaw,
  PositionUpdates
} from './model'

function mapFromDto(dto: PositionsRaw): PositionUpdates {
  const positions = mapPositionsFromDto(dto.CurrentPositions)
  const history = mapHistoricPositionFromDto(dto.History)
  return {
    history,
    currentPositions: positions
  }
}

function mapPositionsFromDto(dtos: CurrencyPairPositionRaw[]): CurrencyPairPosition[] {
  return dtos.map<CurrencyPairPosition>(dto => ({
    symbol: dto.Symbol,
    basePnl: dto.BasePnl,
    baseTradedAmount: dto.BaseTradedAmount,
    basePnlName: 'basePnl',
    baseTradedAmountName: 'baseTradedAmount'
  }))
}

function mapHistoricPositionFromDto(dtos: HistoryRaw[]): HistoricPosition[] {
  return dtos.map<HistoricPosition>(dto => ({
    timestamp: new Date(dto.Timestamp),
    usdPnl: dto.UsdPnl
  }))
}

export default class AnalyticsService {
  constructor(private readonly serviceClient: ServiceClient) {}

  getAnalyticsStream(analyticsRequest: string) {
    return this.serviceClient
      .createStreamOperation<PositionsRaw, string>('analytics', 'getAnalytics', analyticsRequest)
      .pipe(
        retryWhen(retryConstantly({ interval: 3000 })),
        map(dto => mapFromDto(dto))
      )
  }
}
