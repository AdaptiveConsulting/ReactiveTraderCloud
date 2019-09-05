import React from 'react'
import { styled } from 'rt-theme'
import { AnalyticsBarChart } from './analyticsBarChart'
import { CurrencyPairPosition } from '../model'
import { Title } from './styled'

interface PnLProps {
  chartData: CurrencyPairPosition[]
}

export const PnLStyle = styled.div``

export const PnL: React.FC<PnLProps> = ({ chartData }) => {
  return (
    <PnLStyle>
      <Title>PnL</Title>
      <AnalyticsBarChart chartData={chartData} />
    </PnLStyle>
  )
}
