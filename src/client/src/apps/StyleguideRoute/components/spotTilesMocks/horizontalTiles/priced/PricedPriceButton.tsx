import React from 'react'
import { Direction } from 'rt-types'
import {
  Price,
  BigWrapper,
  DirectionLabel,
  Big,
  Pip,
  Tenth,
  ExpiredPrice,
} from 'apps/MainRoute/widgets/spotTile/components/PriceButton/styled'
import styled from 'styled-components/macro'

interface PriceButtonProps {
  big?: number
  pip?: number
  tenth?: number
  rawRate?: number
  direction?: Direction
  handleClick?: () => void
  priceAnnounced?: boolean
  disabled?: boolean
  expired?: boolean
  currencyPairSymbol: string
  isAnalyticsView: boolean
}

const TradeButton = styled.button<{
  direction: Direction
  priceAnnounced: boolean
  isAnalyticsView: boolean
}>`
  background-color: ${({ theme }) => theme.primary[1]};
  border-radius: 3px;
  color: inherit;
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  height: ${({ isAnalyticsView }) => (isAnalyticsView ? '50%' : '59px')};
  min-width: 125px;
  padding: 0.6rem 1.5rem 0.7rem 1.5rem;
  margin-bottom: 2px;
  cursor: initial;
  pointer-events: none;
`

const ExtendedPip = styled(Pip)<{ direction: Direction }>`
  color: ${({ direction }) => (direction === Direction.Sell ? '#f94c4c' : '#5f94f5')};
`
const ExtendedBig = styled(Big)<{ direction: Direction }>`
  color: ${({ direction }) => (direction === Direction.Sell ? '#f94c4c' : '#5f94f5')};
`
const ExtendedTenth = styled(Tenth)<{ direction: Direction }>`
  color: ${({ direction }) => (direction === Direction.Sell ? '#f94c4c' : '#5f94f5')};
`

const renderPips = (pips: number) => (pips.toString().length === 1 ? `0${pips}` : pips)
const getBigFigureDisplay = (bigFigure: number, rawRate: number) =>
  bigFigure === Math.floor(rawRate) ? `${bigFigure}.` : bigFigure.toString()
const renderBigFigureDisplay = (bigFigureDisplay: string) =>
  bigFigureDisplay.toString().length === 3 ? `${bigFigureDisplay}0` : bigFigureDisplay

const PriceButtonComp: React.FC<PriceButtonProps> = ({
  big = 0,
  pip = 0,
  tenth = 0,
  rawRate = 0,
  direction = Direction.Buy,
  handleClick = () => {},
  priceAnnounced,
  disabled = false,
  expired = false,
  currencyPairSymbol,
  isAnalyticsView,
}) => {
  const bigFigure = getBigFigureDisplay(big, rawRate)
  const hasPrice = rawRate !== 0
  const isDisabled = disabled || !hasPrice
  return (
    <TradeButton
      direction={direction}
      onClick={handleClick}
      priceAnnounced={!!priceAnnounced}
      disabled={isDisabled}
      isAnalyticsView={isAnalyticsView}
      data-qa="price-button__trade-button"
      data-qa-id={`direction-${direction.toLowerCase()}-${currencyPairSymbol.toLowerCase()}`}
    >
      <Price disabled={isDisabled}>
        <BigWrapper>
          <DirectionLabel>{direction.toUpperCase()}</DirectionLabel>
          <ExtendedBig direction={direction} data-qa="price-button__big">
            {hasPrice ? renderBigFigureDisplay(bigFigure) : '-'}
          </ExtendedBig>
        </BigWrapper>
        {hasPrice && (
          <React.Fragment>
            <ExtendedPip direction={direction} data-qa="price-button__pip">
              {renderPips(pip)}
            </ExtendedPip>
            <ExtendedTenth direction={direction} data-qa="price-button__tenth">
              {tenth}
            </ExtendedTenth>
          </React.Fragment>
        )}
      </Price>
      {expired && <ExpiredPrice data-qa="price-button__expired">Expired</ExpiredPrice>}
    </TradeButton>
  )
}

export default PriceButtonComp
