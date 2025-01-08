import { useState } from "react"

import { Typography } from "@/client/components/Typography"
import {
  formatAsWholeNumber,
  formatWithScale,
  precisionNumberFormatter,
} from "@/client/utils/formatNumber"

import {
  Bar,
  BarContainer,
  BarPriceContainer,
  CenterLine,
  PriceContainer,
  PriceIndicator,
  PriceLabel,
} from "./styled"

export interface PNLBarProps {
  profitOrLossValue: number
  largetProfitOrLossValue: number
  symbol: string
}

const TRANSLATION_WIDTH = 50

const formatToPrecision2 = precisionNumberFormatter(2)

const getLogRatio: (max: number, numb: number) => number = (max, numb) => {
  const logMax = Math.log10(Math.abs(max)) + 1
  const logNumb = Math.log10(Math.abs(numb))
  return logNumb / logMax
}

const PNLBar = ({
  symbol,
  profitOrLossValue,
  largetProfitOrLossValue,
}: PNLBarProps) => {
  const [hovering, setHovering] = useState(false)
  const color = profitOrLossValue >= 0 ? "positive" : "negative"

  const distance =
    getLogRatio(largetProfitOrLossValue, profitOrLossValue) *
    TRANSLATION_WIDTH *
    (profitOrLossValue >= 0 ? 1 : -1)

  const price = formatWithScale(profitOrLossValue, formatAsWholeNumber)
  const hoverPrice = formatToPrecision2(profitOrLossValue)

  const base = symbol.slice(0, 3)
  const terms = symbol.slice(3)
  return (
    <BarContainer data-testid={`pnlbar-${base + "/" + terms}`}>
      <Typography
        variant="Text xs/Regular"
        color="Colors/Text/text-quaternary (500)"
        data-testid="symbolLabel"
      >
        {base}/{terms}
      </Typography>
      <BarPriceContainer>
        <PriceContainer distance={distance}>
          <PriceLabel
            data-testid="priceLabel"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            distance={distance}
            color={color}
          >
            <Typography
              variant="Text xxs/Regular"
              color="Colors/Border/border-buy"
            >
              {hovering ? hoverPrice : price}
            </Typography>
          </PriceLabel>
        </PriceContainer>
        <Bar>
          <CenterLine />
          <PriceIndicator color={color} distance={distance} />
        </Bar>
      </BarPriceContainer>
    </BarContainer>
  )
}

export default PNLBar
