import * as _ from 'lodash'
import * as React from 'react'
import { CurrencyPairMap } from '../../../types/currencyPair'
import PNLBar from './PNLBar'

export interface AnalyticsBarChartProps {
  chartData: any[]
  currencyPairs: CurrencyPairMap
  isPnL: boolean
}

export default class AnalyticsBarChart extends React.Component<AnalyticsBarChartProps, {}> {
  render() {
    return <div>{!_.isEmpty(this.props.chartData) && this.createBars()}</div>
  }

  createBars() {
    const { isPnL, chartData } = this.props
    const baseValues: any[] = chartData.map(x => x.basePnl)
    const maxValue: number = _.max(baseValues)
    const minValue: number = _.min(baseValues)
    const maxWidth = Math.max(Math.abs(maxValue), Math.abs(minValue))
    const bars = chartData.map((chartItem, index) => {
      const { basePnl, symbol } = chartItem
      const currencyPair = this.props.currencyPairs[symbol]
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
