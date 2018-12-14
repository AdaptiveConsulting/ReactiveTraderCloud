import numeral from 'numeral'
import React from 'react'
import { styled } from 'rt-theme'
export interface PNLBarProps {
  basePnl: number
  maxVal: number
  symbol: string
}

const TRANSLATION_WIDTH: number = 50

const getWidthRatio: (maxWidth: number, width: number) => number = (maxWidth, width) => {
  const logMaxWidth = Math.log10(Math.abs(maxWidth)) + 1
  const logWidth = Math.log10(Math.abs(width))
  return logWidth / logMaxWidth
}
export default class PNLBar extends React.Component<PNLBarProps> {
  render() {
    const { symbol, basePnl, maxVal } = this.props
    const color = basePnl >= 0 ? 'green' : 'red'
    const distance = getWidthRatio(maxVal, basePnl) * TRANSLATION_WIDTH * (basePnl >= 0 ? 1 : -1)
    const price = numeral(Math.abs(basePnl)).format('0a')
    return (
      <BarChart>
        <LabelBarWrapper>
          <Label>{symbol}</Label>
          <BarWrapper>
            <PriceDiamondLabelWrapper distance={distance}>
              <PriceLabel color={color}>{price}</PriceLabel>
              <DiamondShape color={color} />
            </PriceDiamondLabelWrapper>
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

const BarChart = styled.div``
const OriginTickWrapper = styled.div``

const LabelBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
const PriceDiamondLabelWrapper = styled.div<{ distance: number }>`
  flex: 0.99;
  margin-bottom: -2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s;
  transform: translate(${({ distance }) => distance}%);
`
const PriceLabel = styled.div<{ color: string }>`
  flex: 1;
  width: 25px;
  height: 13px;
  text-align: center;
  font-size: 11px;
  margin-bottom: 2px;
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
  top: 16px;
  width: 44px;
  height: 13px;
  opacity: 0.6;
  font-size: 11px;
  text-align: center;
  color: #ffffff;
`
const BarWrapper = styled.div`
  flex: 0.99;
  vertical-align: middle;
  margin: auto 0;
  color: white;
  padding-left: 10px;
`
const Bar = styled.div`
  height: 0.125rem;
  background-color: #444c5f;
  width: 100%;
  position: relative;
  top: 5px;
  border: 1px solid #444c5f;
`
const OriginTick = styled.div`
  position: relative;
  width: 1.6px;
  height: 6.9px;
  background-color: #444c5f;
  margin: 0 auto;
  top: 3px;
`
const Origin = styled.div`
  margin: 0 auto;
  display: block;
  height: 10px;
  margin-top: 1px;
  width: 5.9px;
  height: 20px;
  opacity: 0.6;
  font-size: 11px;
  text-align: center;
`
