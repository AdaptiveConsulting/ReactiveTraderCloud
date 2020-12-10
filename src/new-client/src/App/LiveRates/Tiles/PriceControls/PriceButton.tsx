import React from 'react'
import { Direction } from 'services/trades'
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


interface Props{
    direction: Direction
    big?: number
    pip?: number
    tenth?: number
    rawRate?: number
    disabled?: boolean
}

const renderPips = (pips: number) => (pips.toString().length === 1 ? `0${pips}` : pips)
const getBigFigureDisplay = (bigFigure: number, rawRate: number) =>
  bigFigure === Math.floor(rawRate) ? `${bigFigure}.` : bigFigure.toString()
const renderBigFigureDisplay = (bigFigureDisplay: string) =>
  bigFigureDisplay.toString().length === 3 ? `${bigFigureDisplay}0` : bigFigureDisplay

export const PriceButton: React.FC<Props> = ({
    direction = Direction.Buy,
    big = 0,
    pip = 0,
    tenth = 0,
    rawRate = 0,
    disabled = false,
}) => {
  
  const bigFigure = getBigFigureDisplay(big, rawRate)
  const hasPrice = rawRate !== 0
  const handleClick = () =>{}
  const priceAnnounced = true
  const isDisabled = disabled || !hasPrice
  const expired = false
  return (
    <TradeButton
      direction={direction}
      onClick={handleClick}
      priceAnnounced={!!priceAnnounced}
      disabled={isDisabled}
      expired={expired}
      data-qa="price-button__trade-button">
      <Price disabled={isDisabled}>
        <BigWrapper>
          <DirectionLabel >{direction.toUpperCase()}</DirectionLabel>
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
      
    </TradeButton>
  )
}
