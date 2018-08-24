import { CurrencyPairPosition } from './currencyPairPosition'

export type PositionsChartModel = ReturnType<typeof getPositionsChartModel>

export const getPositionsChartModel = (data: CurrencyPairPosition[]) => {
  const baseTradedAmount = 'baseTradedAmount' // from CurrencyPairPosition

  return {
    seriesData: data,
    options: {
      showYAxis: true,
      showXAxis: true,
      showLegend: false,
      useInteractiveGuideline: true,
      duration: 0,
      showValues: true,
      showControls: false,
      width: 900,
      tooltip: {
        enabled: false
      },
      margin: {
        top: 0,
        right: 0,
        bottom: 0
      }
    },
    yAxisValuePropertyName: baseTradedAmount
  }
}
