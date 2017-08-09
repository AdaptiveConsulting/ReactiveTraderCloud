import * as React from 'react'
import PNLBar from './PNLBar'
import { map, max, min } from 'lodash'

export interface AnalyticsBarChartProps {
  chartData: any[]
  isPnL: boolean
}

export default class AnalyticsBarChart extends React.Component<AnalyticsBarChartProps, {}>{

  render() {
    const bars = this.createBars()
    return (
      <div>{bars}</div>
    )
  }

  createBars() {
    // const propName = CurrencyPairPosition.basePnlName // 'basePnl' was here
    const { isPnL, chartData } = this.props

    const baseValues: any[] = map(chartData, 'basePnl')
    const maxValue: number = max(baseValues)
    const minValue: number = min(baseValues)

    const maxWidth =  Math.max(Math.abs(maxValue), Math.abs(minValue))
    const bars = chartData.map(({ basePnl, symbol, currencyPair }, index) => {
      return (
        <PNLBar key={index}
                index={index}
                basePnl={basePnl}
                symbol={symbol}
                currencyPair={currencyPair}
                isPnL={isPnL}
                maxVal={maxWidth}/>
      )
    })
    return bars
  }
}
