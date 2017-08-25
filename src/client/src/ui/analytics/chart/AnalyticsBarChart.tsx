import * as React from 'react'
import * as _ from 'lodash'
import PNLBar from './PNLBar';

export interface AnalyticsBarChartProps {
  chartData: any[]
  isPnL: boolean
}

export default class AnalyticsBarChart extends React.Component<AnalyticsBarChartProps, {}> {

  render() {
    return (
      <div>
        {!_.isEmpty(this.props.chartData) && this.createBars()}
      </div>
    )
  }

  createBars() {
    const { isPnL, chartData } = this.props
    const baseValues: any[] = _.map(chartData, 'basePnl')
    const maxValue: number = _.max(baseValues)
    const minValue: number = _.min(baseValues)
    const maxWidth = Math.max(Math.abs(maxValue), Math.abs(minValue))
    const bars = chartData.map(({ basePnl, symbol, currencyPair }, index) => {
      return (
        <PNLBar
          key={index}
          index={index}
          basePnl={basePnl}
          symbol={symbol}
          currencyPair={currencyPair}
          isPnL={isPnL}
          maxVal={maxWidth}
        />
      )
    })
    return bars
  }
}
