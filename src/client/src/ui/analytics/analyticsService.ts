import { ServiceClient, retryWithBackOff } from 'rt-system'
import { map, retryWhen } from 'rxjs/operators'
import {
  CurrencyPairPosition,
  CurrencyPairPositionRaw,
  HistoricPosition,
  HistoryRaw,
  PositionsRaw,
  PositionUpdates,
} from './model'

const LOG_NAME = 'Analytics Service:'

function mapFromDto(dto: PositionsRaw): PositionUpdates {
  const positions = mapPositionsFromDto(dto.CurrentPositions)
  const history = mapHistoricPositionFromDto(dto.History)
  return {
    history,
    currentPositions: positions,
  }
}

function mapPositionsFromDto(dtos: CurrencyPairPositionRaw[]): CurrencyPairPosition[] {
  return dtos.map<CurrencyPairPosition>(dto => ({
    symbol: dto.Symbol,
    basePnl: dto.BasePnl,
    baseTradedAmount: dto.BaseTradedAmount,
    basePnlName: 'basePnl',
    baseTradedAmountName: 'baseTradedAmount',
  }))
}

function mapHistoricPositionFromDto(dtos: HistoryRaw[]): HistoricPosition[] {
  return dtos.map<HistoricPosition>(dto => ({
    timestamp: new Date(dto.Timestamp),
    usdPnl: dto.UsdPnl,
  }))
}

export default class AnalyticsService {
  constructor(private readonly serviceClient: ServiceClient) {}
  getAnalyticsStream(analyticsRequest: string) {
    console.info(LOG_NAME, 'Subscribing to analytics stream')
    return this.serviceClient
      .createStreamOperation<PositionsRaw, string>('analytics', 'getAnalytics', analyticsRequest) //Ana observable of response from backend
      .pipe(
        retryWhen(retryWithBackOff()),
        map(dto => mapFromDto(dto)),
      )
  }
}
