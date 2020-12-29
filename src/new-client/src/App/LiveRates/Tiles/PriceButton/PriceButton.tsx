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
      map(([value, { pipsPosition, ratePrecision }]) => {
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

        return { disabled, pip, tenth, bigFigure }
      }),
    ),
)

export const priceButton$ = (direction: Direction) => (symbol: string) =>
  getPriceButtonData$(direction, symbol)

const getSpotRate = (pip: string, tenth: number, bigFigure: string): number => {
  return parseFloat(`${bigFigure}${pip}${tenth.toString()}`)
}

export const [useDealtCurrency, getDealtCurrency$] = bind((symbol: string) =>
  getCurrencyPair$(symbol).pipe(map(({ base, terms }) => `${base}`)),
)

export const PriceButton: React.FC<{
  direction: Direction
  symbol: string
}> = ({ direction, symbol }) => {
  const { disabled, pip, tenth, bigFigure } = usePriceButtonData(
    direction,
    symbol,
  )
  const dealtCurrency = useDealtCurrency(symbol)

  const onClick = () => {
    onNewExecution({
      currencyPair: symbol,
      dealtCurrency,
      direction,
      notional: 1000_000,
      spotRate: getSpotRate(pip, tenth, bigFigure)
    })
  }

  return (
    <TradeButton
      direction={direction}
      onClick={onClick}
      priceAnnounced
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
