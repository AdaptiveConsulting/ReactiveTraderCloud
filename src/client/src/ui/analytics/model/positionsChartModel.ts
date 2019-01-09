import { CurrencyPairPosition } from './currencyPairPosition'

export type PositionsChartModel = ReturnType<typeof getPositionsChartModel>

export const getPositionsChartModel = (data: CurrencyPairPosition[]) => ({ seriesData: data })
