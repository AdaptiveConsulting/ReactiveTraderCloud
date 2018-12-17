import numeral from 'numeral'
import React from 'react'
import { styled } from 'rt-theme'
export interface PNLBarProps {
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
export default class PNLBar extends React.Component<PNLBarProps> {
  render() {
    const { symbol, basePnl, maxVal } = this.props
    const color = basePnl >= 0 ? 'green' : 'red'
    const distance = getLogRatio(maxVal, basePnl) * TRANSLATION_WIDTH * (basePnl >= 0 ? 1 : -1)
    const price = numeral(Math.abs(basePnl)).format('0a')
    return (
      <BarChart>
        <LabelBarWrapper>
          <Label />
          <PriceDiamondLabelWrapper distance={distance}>
            <PriceLabel color={color}>{price}</PriceLabel>
            <DiamondShape color={color} />
          </PriceDiamondLabelWrapper>
        </LabelBarWrapper>
        <LabelBarWrapper>
          <Label>{symbol}</Label>
          <BarWrapper>
            <Bar />
            <OriginTickWrapper>
              <OriginTick />
              <Origin>0</Origin>
            </OriginTickWrapper>
          </BarWrapper>
        </LabelBarWrapper>
      </BarChart>
    )
  }
}

const BarChart = styled.div`
  display: flex;
  flex-direction: column;
`
const OriginTickWrapper = styled.div``

const LabelBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
const PriceDiamondLabelWrapper = styled.div<{ distance: number }>`
  flex: 0.99;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 12px;
  transition: transform 0.5s;
  transition-timing-function: ${({ theme }) => theme.motion.easing};
  transform: translate(${({ distance }) => distance}%);
`
const PriceLabel = styled.div<{ color: string }>`
  width: 25px;
  font-size: 11px;
  text-align: center;
  color: ${({ theme, color }) => theme.analytics[color].normal};
`
const DiamondShape = styled.div<{ color: string }>`
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
  background-color: ${({ theme, color }) => theme.analytics[color].normal};
`
const Label = styled.div`
  position: relative;
  bottom: 7px;
  width: 50px;
  opacity: 0.6;
  font-size: 11px;
  color: ${({ theme }) => theme.analytics.textColor};
`
const BarWrapper = styled.div`
  flex: 0.99;
  color: white;
  justify-content: center;
  align-items: center;
  padding-left: 12px;
  display: flex;
  flex-direction: column;
`
const Bar = styled.div`
  background-color: #444c5f;
  height: 0.125rem;
  width: 100%;
  // position: relative;
  border: 1px solid #444c5f;
  // top: 5px;
`
const OriginTick = styled.div`
  width: 1.6px;
  height: 5px;
  background-color: #444c5f;
  border: 1px solid #444c5f;
  margin: 0 auto;
`
const Origin = styled.div`
  margin: 0 auto;
  height: 20px;
  opacity: 0.6;
  font-size: 11px;
  text-align: center;
  color: ${({ theme }) => theme.analytics.textColor};
`
