import { CurrencyPairPosition } from './currencyPairPosition'

export const getPositionsChartModel = (data: CurrencyPairPosition[]) => ({ seriesData: data })

export type PositionsChartModel = ReturnType<typeof getPositionsChartModel>
