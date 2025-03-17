import { useState } from "react"

import { Stack } from "@/client/components/Stack"
import { Typography } from "@/client/components/Typography"
import {
  formatAsWholeNumber,
  formatWithScale,
  precisionNumberFormatter,
} from "@/client/utils/formatNumber"

import {
  Bar,
  BarPriceContainer,
  CenterLine,
  PriceContainer,
  PriceIndicator,
  PriceIndicatorContainer,
  PriceLabel,
} from "./styled"

export interface PNLBarProps {
  profitOrLossValue: number
  largestProfitOrLossValue: number
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
  largestProfitOrLossValue,
}: PNLBarProps) => {
  const [hovering, setHovering] = useState(false)

  const distance =
    getLogRatio(largestProfitOrLossValue, profitOrLossValue) *
    TRANSLATION_WIDTH *
    (profitOrLossValue >= 0 ? 1 : -1)

  const price = formatWithScale(profitOrLossValue, formatAsWholeNumber)
  const hoverPrice = formatToPrecision2(profitOrLossValue)

  const base = symbol.slice(0, 3)
  const terms = symbol.slice(3)
  return (
    <Stack
      justifyContent="space-between"
      alignItems="flex-end"
      marginBottom="md"
      data-testid={`pnlbar-${base + "/" + terms}`}
      gap="5xl"
    >
      <Typography
        variant="Text sm/Regular"
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
          <PriceIndicatorContainer distance={distance}>
            <PriceIndicator />
          </PriceIndicatorContainer>
        </Bar>
      </BarPriceContainer>
    </Stack>
  )
}

export default PNLBar
