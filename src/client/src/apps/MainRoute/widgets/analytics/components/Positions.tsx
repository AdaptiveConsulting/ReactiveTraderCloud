import React from 'react'
import { CurrencyPairs } from './Analytics'
import { CurrencyPairPosition } from '../model'
import { BubbleChart, Title } from './styled'
import PositionsBubbleChart from './positions-chart/PositionsBubbleChart'
import { styled } from 'rt-theme'

interface PositionProps {
  data: CurrencyPairPosition[]
  currencyPairs: CurrencyPairs
}
export const PositionStyle = styled.div``
export const Positions: React.FC<PositionProps> = ({ data, currencyPairs }) => {
  return (
    <PositionStyle>
      <Title>Positions</Title>
      <BubbleChart>
        <PositionsBubbleChart data={data} currencyPairs={currencyPairs} />
      </BubbleChart>
    </PositionStyle>
  )
}
