import React from 'react'
import { CurrencyPairs } from './Analytics'
import { CurrencyPairPosition } from '../model'
import { BubbleChart, Title } from './styled'
import PositionsBubbleChart from './positions-chart/PositionsBubbleChart'

interface PositionProps {
  data: CurrencyPairPosition[]
  currencyPairs: CurrencyPairs
}

export const Positions: React.FC<PositionProps> = ({ data, currencyPairs }) => {
  return (
    <React.Fragment>
      <Title>Positions</Title>
      <BubbleChart>
        <PositionsBubbleChart data={data} currencyPairs={currencyPairs} />
      </BubbleChart>
    </React.Fragment>
  )
}
