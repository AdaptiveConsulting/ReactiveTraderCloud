import { useState } from "react"
import {
  formatAsWholeNumber,
  formatWithScale,
  precisionNumberFormatter,
} from "@/utils/formatNumber"
import {
  BarChart,
  BarPriceContainer,
  Label,
  Offset,
  PriceContainer,
  PriceLabel,
  DiamondShape,
  Bar,
  OriginTickWrapper,
  OriginTick,
} from "./styled"
interface PNLBarProps {
  basePnl: number
  maxVal: number
  symbol: string
}

const TRANSLATION_WIDTH: number = 50

const formatToPrecision2 = precisionNumberFormatter(2)

const getLogRatio: (max: number, numb: number) => number = (max, numb) => {
  const logMax = Math.log10(Math.abs(max)) + 1
  const logNumb = Math.log10(Math.abs(numb))
  return logNumb / logMax
}

const PNLBar: React.FC<PNLBarProps> = ({ symbol, basePnl, maxVal }) => {
  const [hovering, setHovering] = useState(false)
  const color = basePnl >= 0 ? "positive" : "negative"
  const distance =
    getLogRatio(maxVal, basePnl) * TRANSLATION_WIDTH * (basePnl >= 0 ? 1 : -1)
  const price = formatWithScale(basePnl, formatAsWholeNumber)
  const hoverPrice = formatToPrecision2(basePnl)
  return (
    <BarChart>
      <Label data-testid="symbolLabel">{symbol}</Label>
      <Offset />
      <BarPriceContainer>
        <PriceContainer distance={distance}>
          <PriceLabel
            data-testid="priceLabel"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            distance={distance}
            color={color}
          >
            {hovering ? hoverPrice : price}
          </PriceLabel>
          <DiamondShape color={color} />
        </PriceContainer>
        <Bar />
        <OriginTickWrapper>
          <OriginTick />
        </OriginTickWrapper>
      </BarPriceContainer>
    </BarChart>
  )
}

export default PNLBar
