import numeral from 'numeral'
import React from 'react'
import { styled } from 'rt-theme'
export interface PNLBarProps {
  basePnl: number
  maxVal: number
  symbol: string
}

export const TRANSLATION_WIDTH: number = 50

export const getLogRatio: (max: number, numb: number) => number = (max, numb) => {
  const logMax = Math.log10(Math.abs(max)) + 1
  const logNumb = Math.log10(Math.abs(numb))
  return logNumb / logMax
}
export default class PNLBar extends React.Component<PNLBarProps> {
  render() {
    const { symbol, basePnl, maxVal } = this.props
    console.log(symbol, basePnl, maxVal)
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
            <Origin>0</Origin>
          </OriginTickWrapper>
        </BarPriceContainer>
      </BarChart>
    )
  }
}

const BarChart = styled.div`
  display: flex;
`
const PriceContainer = styled.div<{ distance: number }>`
  width: 100%;
  text-align: center;
  vertical-align: middle;
  align-content: center;
  font-size: 11px;
  transition: transform 0.5s;
  transition-timing-function: ${({ theme }) => theme.motion.easing};
  transform: translate(${({ distance }) => distance}%);
`

const Offset = styled.div`
  flex: 0 1 20px;
`
const OriginTickWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PriceLabel = styled.span<{ color: string }>`
  font-size: 11px;
  color: ${({ theme, color }) => theme.analytics[color].normal};
`
const DiamondShape = styled.span<{ color: string }>`
  display: block;
  margin: 0 auto;
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
  background-color: ${({ theme, color }) => theme.analytics[color].normal};
`
const Label = styled.div`
  width: 20%;
  margin: auto 0;
  opacity: 0.6;
  font-size: 11px;
  color: ${({ theme }) => theme.analytics.textColor};
`
const BarPriceContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 1;
`
const Bar = styled.div`
  background-color: #444c5f;
  height: 0.125rem;
  width: 100%;
  border: 1px solid #444c5f;
`
const OriginTick = styled.div`
  width: 1.6px;
  height: 5px;
  background-color: #444c5f;
  border: 1px solid #444c5f;
`
const Origin = styled.div`
  font-size: 11px;
  text-align: center;
  color: ${({ theme }) => theme.analytics.textColor};
`
