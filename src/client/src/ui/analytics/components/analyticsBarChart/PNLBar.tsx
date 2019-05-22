import numeral from 'numeral'
import React from 'react'
import {
  BarChart,
  BarPriceContainer,
  Label,
  Offset,
  PriceContainer,
  PriceLabel,
  DiamondShape,
  Bar,
  OriginTickWrapper,
  OriginTick,
} from './styled'
interface PNLBarProps {
  basePnl: number
  maxVal: number
  symbol: string
}

const TRANSLATION_WIDTH: number = 50

const getLogRatio: (max: number, numb: number) => number = (max, numb) => {
  const logMax = Math.log10(Math.abs(max)) + 1
  const logNumb = Math.log10(Math.abs(numb))
  return logNumb / logMax
}

const PNLBar: React.FC<PNLBarProps> = ({ symbol, basePnl, maxVal }) => {
  const color = basePnl >= 0 ? 'green' : 'red'
  const distance = getLogRatio(maxVal, basePnl) * TRANSLATION_WIDTH * (basePnl >= 0 ? 1 : -1)
  const price = numeral(Math.abs(basePnl)).format('0a')

  return (
    <BarChart>
      <Label>{symbol}</Label>
      <Offset />
      <BarPriceContainer>
        <PriceContainer distance={distance}>
          <PriceLabel color={color}>{price}</PriceLabel>
          <DiamondShape color={color} />
        </PriceContainer>
        <Bar />
        <OriginTickWrapper>
          <OriginTick />
        </OriginTickWrapper>
      </BarPriceContainer>
    </BarChart>
  )
}

export default PNLBar
