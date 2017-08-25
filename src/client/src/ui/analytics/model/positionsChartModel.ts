import CurrencyPairPosition from '../../../services/model/currencyPairPosition';

export interface PositionsChartModel {
  seriesData: any[]
  options: {
    showYAxis: boolean
    showXAxis: boolean
    showLegend: boolean
    useInteractiveGuideline: boolean
    duration: number
    showValues: boolean
    showControls: boolean
    tooltip: {
      enabled: boolean,
    },
    margin: {
      top: number
      right: number
      bottom: number,
    },
  },
  yAxisValuePropertyName: any
}

export const getPositionsChartModel = (data) => {
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
    yAxisValuePropertyName: CurrencyPairPosition.baseTradedAmountName
  }
}
