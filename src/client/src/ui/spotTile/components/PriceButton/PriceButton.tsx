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
  return (
    <TradeButton
      direction={direction}
      onClick={handleClick}
      priceAnnounced={priceAnnounced}
      disabled={disabled}
    >
      <Price disabled={disabled}>
        <BigWrapper>
          <DirectionLabel>{direction.toUpperCase()}</DirectionLabel>
          <Big>{renderBigFigureDisplay(bigFigure)}</Big>
        </BigWrapper>
        <Pip>{renderPips(pip)}</Pip>
        <Tenth>{tenth}</Tenth>
      </Price>
      {expired && <ExpiredPrice>Expired</ExpiredPrice>}
    </TradeButton>
  )
}

export default PriceButtonComp
