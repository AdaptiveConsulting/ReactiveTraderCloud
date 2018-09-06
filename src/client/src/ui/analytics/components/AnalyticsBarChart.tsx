import React from 'react'
import { CurrencyPairMap } from 'rt-types'
import { CurrencyPairPosition } from '../model'
import PNLBar from './PNLBar'

export interface Props {
  chartData: CurrencyPairPosition[]
  currencyPairs: CurrencyPairMap
  isPnL: boolean
}

const AnalyticsBarChart: React.SFC<Props> = ({ isPnL, chartData, currencyPairs }) => {
  const { max, min } = getMinMax(chartData)
  const maxWidth = Math.max(Math.abs(max), Math.abs(min))

  return (
    <React.Fragment>
      {chartData.map((chartItem, index) => {
        const { basePnl, symbol } = chartItem
        const currencyPair = currencyPairs[symbol]
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
      })}
    </React.Fragment>
  )
}

export default AnalyticsBarChart

const getMinMax = (chartData: CurrencyPairPosition[]) =>
  chartData.reduce(
    (prev, curr) => {
      const { basePnl } = curr
      prev.max = Math.max(prev.max, basePnl)
      prev.min = Math.min(prev.min, basePnl)
      return prev
    },
    { max: 0, min: 0 }
  )
