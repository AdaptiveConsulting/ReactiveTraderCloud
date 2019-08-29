import { HistoricPosition } from './historicPosition'

export interface PricePoint {
  x: any
  y: any
}

export interface AnalyticsLineChartModel {
  lastPos: number
  seriesData: PricePoint[]
}

const DEFAULT_PNL: AnalyticsLineChartModel = {
  lastPos: 0,
  seriesData: [],
}

export const getModel: (positions: HistoricPosition[]) => AnalyticsLineChartModel = (positions = []) => {
  if (positions.length === 0) {
    return DEFAULT_PNL
  }

  const seriesData: PricePoint[] = positions
    .filter(item => item != null)
    .map(item => ({ x: new Date(item.timestamp), y: item.usdPnl.toFixed(2) }))

  const lastPosition = positions.slice(-1)[0]
  if (lastPosition) {
    return {
      seriesData,
      lastPos: parseInt(lastPosition.usdPnl.toFixed(2), 10),
    }
  }
  return DEFAULT_PNL
}
