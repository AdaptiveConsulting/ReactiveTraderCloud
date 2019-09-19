import React from 'react'
import { Direction } from 'rt-types'
import {
  TradeButton,
  Price,
  BigWrapper,
  DirectionLabel,
  Big,
  Pip,
  Tenth,
  ExpiredPrice,
} from './styled'

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
}

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
}) => {
  const bigFigure = getBigFigureDisplay(big, rawRate)
  const hasPrice = rawRate !== 0
  const isDisabled = disabled || !hasPrice
  return (
    <TradeButton
      direction={direction}
      onClick={handleClick}
      priceAnnounced={priceAnnounced}
      disabled={isDisabled}
      data-qa="price-button__trade-button"
    >
      <Price disabled={isDisabled}>
        <BigWrapper>
          <DirectionLabel data-qa="price-button__direction-label">
            {direction.toUpperCase()}
          </DirectionLabel>
          <Big data-qa="price-button__big">
            {hasPrice ? renderBigFigureDisplay(bigFigure) : '-'}
          </Big>
        </BigWrapper>
        {hasPrice && (
          <React.Fragment>
            <Pip data-qa="price-button__pip">{renderPips(pip)}</Pip>
            <Tenth data-qa="price-button__tenth">{tenth}</Tenth>
          </React.Fragment>
        )}
      </Price>
      {expired && <ExpiredPrice data-qa="price-button__expired">Expired</ExpiredPrice>}
    </TradeButton>
  )
}

export default PriceButtonComp
