import React from "react"
import { Direction } from "services/trades"
import {
  customNumberFormatter,
  significantDigitsNumberFormatter,
} from "utils/formatNumber"
import {
  TradeButton,
  Price,
  BigWrapper,
  DirectionLabel,
  Big,
  Pip,
  Tenth,
} from "./styled"

interface Props {
  direction: Direction
  big?: number
  pip?: number
  tenth?: number
  rawRate?: number
  disabled?: boolean
}

const formatTo3Digits = significantDigitsNumberFormatter(3)
const formatToMin2IntDigits = customNumberFormatter({
  minimumIntegerDigits: 2,
})

export const PriceButton: React.FC<Props> = ({
  direction = Direction.Buy,
  big = 0,
  pip = 0,
  tenth = 0,
  rawRate = 0,
  disabled = false,
}) => {
  const hasPrice = rawRate !== 0
  const handleClick = () => {}
  const priceAnnounced = true
  const isDisabled = disabled || !hasPrice
  const expired = false

  let bigFigure = formatTo3Digits(big)
  if (big === Math.floor(rawRate)) {
    bigFigure += "."
  }

  return (
    <TradeButton
      direction={direction}
      onClick={handleClick}
      priceAnnounced={!!priceAnnounced}
      disabled={isDisabled}
      expired={expired}
      data-qa="price-button__trade-button"
    >
      <Price disabled={isDisabled}>
        <BigWrapper>
          <DirectionLabel>{direction.toUpperCase()}</DirectionLabel>
          <Big data-qa="price-button__big">{hasPrice ? bigFigure : "-"}</Big>
        </BigWrapper>
        {hasPrice && (
          <React.Fragment>
            <Pip data-qa="price-button__pip">{formatToMin2IntDigits(pip)}</Pip>
            <Tenth data-qa="price-button__tenth">{tenth}</Tenth>
          </React.Fragment>
        )}
      </Price>
    </TradeButton>
  )
}
