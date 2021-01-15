import { distinctUntilChanged, map, withLatestFrom } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { getCurrencyPair$ } from "services/currencyPairs"
import { getPrice$ } from "services/prices"
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
} from "./PriceButtonStyles"
import { onNewExecution } from "services/executions"
import { SymbolContext } from "../Tile"
import { useContext } from "react"

const formatTo3Digits = significantDigitsNumberFormatter(3)
const formatToMin2IntDigits = customNumberFormatter({
  minimumIntegerDigits: 2,
})

const [usePriceButtonData, getPriceButtonData$] = bind(
  (direction: Direction, symbol: string) =>
    getPrice$(symbol).pipe(
      map(({ bid, ask }) => (direction === Direction.Buy ? ask : bid)),
      distinctUntilChanged(),
      withLatestFrom(getCurrencyPair$(symbol)),
      map(([value, { base, pipsPosition, ratePrecision }]) => {
        const rateString = value.toFixed(ratePrecision)
        const [wholeNumber, fractions_] = rateString.split(".")
        const fractions = fractions_ || "00000"

        const disabled = value === 0
        const pip = formatToMin2IntDigits(
          Number(fractions.substring(pipsPosition - 2, pipsPosition)),
        )
        const tenth = Number(
          fractions.substring(pipsPosition, pipsPosition + 1),
        )

        const bigFigureNumber = Number(
          wholeNumber + "." + fractions.substring(0, pipsPosition - 2),
        )
        let bigFigure = formatTo3Digits(bigFigureNumber)
        if (bigFigureNumber === Math.floor(bigFigureNumber)) bigFigure += "."

        return { base, disabled, pip, tenth, bigFigure }
      }),
    ),
)

export const priceButton$ = (direction: Direction) => (symbol: string) =>
  getPriceButtonData$(direction, symbol)

const calculateSpotRate = (
  pip: string,
  tenth: number,
  bigFigure: string,
): number => {
  return parseFloat(`${bigFigure}${pip}${tenth.toString()}`)
}

export const PriceButton: React.FC<{
  direction: Direction
}> = ({ direction }) => {
  const symbol = useContext(SymbolContext)
  const { base, disabled, pip, tenth, bigFigure } = usePriceButtonData(
    direction,
    symbol,
  )

  const onClick = () => {
    onNewExecution({
      currencyPair: symbol,
      dealtCurrency: base,
      direction,
      notional: 1000_000,
      spotRate: calculateSpotRate(pip, tenth, bigFigure),
    })
  }

  return (
    <TradeButton
      direction={direction}
      onClick={onClick}
      priceAnnounced={false}
      disabled={disabled}
      data-qa="price-button__trade-button"
    >
      <Price disabled={disabled}>
        <BigWrapper>
          <DirectionLabel>{direction.toUpperCase()}</DirectionLabel>
          <Big data-qa="price-button__big">{disabled ? "-" : bigFigure}</Big>
        </BigWrapper>
        {!disabled && (
          <>
            <Pip data-qa="price-button__pip">{pip}</Pip>
            <Tenth data-qa="price-button__tenth">{tenth}</Tenth>
          </>
        )}
      </Price>
    </TradeButton>
  )
}
