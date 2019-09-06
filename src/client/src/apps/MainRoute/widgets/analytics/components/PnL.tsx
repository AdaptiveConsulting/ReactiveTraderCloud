import React from 'react'
import { AnalyticsBarChart } from './analyticsBarChart'
import { CurrencyPairPosition } from '../model'
import { Title } from './styled'

interface PnLProps {
  chartData: CurrencyPairPosition[]
}

export const PnL: React.FC<PnLProps> = ({ chartData }) => {
  return (
    <div>
      <Title>PnL</Title>
      <AnalyticsBarChart chartData={chartData} />
    </div>
  )
}
