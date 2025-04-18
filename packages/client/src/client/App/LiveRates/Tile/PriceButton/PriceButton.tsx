import { bind } from "@react-rxjs/core"
import { of } from "rxjs"
import { map, switchMap } from "rxjs/operators"

import { isBuy } from "@/client/App/Credit/common"
import { AdaptiveLoader } from "@/client/components/AdaptiveLoader"
import { Box } from "@/client/components/Box"
import { ForbiddenIcon } from "@/client/components/icons"
import { Stack } from "@/client/components/Stack"
import { Typography } from "@/client/components/Typography"
import {
  customNumberFormatter,
  DECIMAL_SEPARATOR,
  significantDigitsNumberFormatter,
} from "@/client/utils/formatNumber"
import { Direction } from "@/generated/TradingGateway"
import { CurrencyPair } from "@/services/currencyPairs"
import { getPrice$ } from "@/services/prices"

import { useIsNotionalValid } from "../Notional/Notional"
import { QuoteStateStage, useRfqState } from "../Rfq"
import { getRfqPayload$, QuoteState, useIsRfq } from "../Rfq/Rfq.state"
import { useTileCurrencyPair } from "../Tile.context"
import { sendExecution } from "../Tile.state"
import {
  PriceButtonDisabledPlaceholder,
  QuotePriceLoading,
  TradeButton,
} from "./PriceButton.styles"

const getPriceByDirection$ = (symbol: string, direction: Direction) =>
  getPrice$(symbol).pipe(
    map(({ bid, ask }) => (isBuy(direction) ? ask : bid)),
    map((price) => ({ isExpired: false, price })),
  )

const [usePrice, getPriceDirection$] = bind(
  (symbol: string, direction: Direction) =>
    getRfqPayload$(symbol).pipe(
      switchMap((payload) =>
        payload
          ? of({
              ...payload,
              price: isBuy(direction)
                ? payload.rfqResponse.price.ask
                : payload.rfqResponse.price.bid,
            })
          : getPriceByDirection$(symbol, direction),
      ),
    ),
)

export const priceButton$ = (direction: Direction) => (symbol: string) =>
  getPriceDirection$(symbol, direction)

const formatSimple = customNumberFormatter()
const formatTo2Digits = significantDigitsNumberFormatter(2)
const formatTo3Digits = significantDigitsNumberFormatter(3)
const formatToMin2IntDigits = customNumberFormatter({
  minimumIntegerDigits: 2,
})

export type PriceButtonProps = {
  direction: Direction
  price: number
  currencyPair: CurrencyPair
  priceAnnounced: boolean
  disabled: boolean
  isExpired: boolean
  isStatic?: boolean
  onClick: () => void
}

export const PriceButtonInner = ({
  direction,
  price,
  currencyPair,
  priceAnnounced,
  disabled,
  isExpired,
  isStatic,
  onClick,
}: PriceButtonProps) => {
  const { pipsPosition, ratePrecision } = currencyPair
  const rateString = price.toFixed(ratePrecision)
  const [wholeNumber, fractions_] = rateString.split(".")
  const fractions = fractions_ || "00000"

  const pip = formatToMin2IntDigits(
    Number(fractions.substring(pipsPosition - 2, pipsPosition)),
  )
  const tenth = formatSimple(
    Number(fractions.substring(pipsPosition, pipsPosition + 1)),
  )

  const bigFigureNumber = Number(
    wholeNumber + "." + fractions.substring(0, pipsPosition - 2),
  )
  let bigFigure =
    bigFigureNumber < 1 && pipsPosition === 4
      ? formatTo2Digits(bigFigureNumber)
      : formatTo3Digits(bigFigureNumber)
  if (bigFigureNumber === Math.floor(bigFigureNumber))
    bigFigure += DECIMAL_SEPARATOR

  return (
    <TradeButton
      direction={direction}
      onClick={onClick}
      priceAnnounced={priceAnnounced}
      disabled={disabled}
      isStatic={isStatic}
      isExpired={isExpired}
      data-testid={`${direction}-${currencyPair.symbol}`}
    >
      <Stack justifyContent="center" alignItems="center" direction="column">
        <Typography color={disabled ? "Colors/Text/text-disabled" : "inherit"}>
          <Typography
            display="inline"
            variant="Text xxs/Regular"
            className="symbol"
          >
            {`${direction} ${currencyPair.base}`.toUpperCase()}
          </Typography>
          <Box color="inherit">
            <Typography display="inline" variant="Text sm/Regular">
              {price ? bigFigure : "-"}
            </Typography>
            {price && (
              <>
                <Typography
                  lineHeight={1}
                  display="inline"
                  variant="Display xl/Regular"
                >
                  {pip}
                </Typography>
                <Typography display="inline" variant="Text sm/Regular">
                  {tenth}
                </Typography>
              </>
            )}
            {isExpired && (
              <Typography
                variant="Text xs/Regular"
                color="Colors/Text/text-error-primary (600)"
                textTransform="uppercase"
                data-testid="expireLabel"
              >
                Expired
              </Typography>
            )}
          </Box>
        </Typography>
      </Stack>
    </TradeButton>
  )
}

const PriceButtonContainer = ({
  direction,
  rfqQuoteState,
}: {
  direction: Direction
  rfqQuoteState: QuoteState
}) => {
  const currencyPair = useTileCurrencyPair()
  const { price, isExpired } = usePrice(currencyPair.symbol, direction)
  const isRfq = useIsRfq()
  const isNotionalValid = useIsNotionalValid()
  const disabled =
    price === 0 ||
    !isNotionalValid ||
    (isRfq && rfqQuoteState.stage !== QuoteStateStage.Received)

  return (
    <PriceButtonInner
      direction={direction}
      price={price}
      currencyPair={currencyPair}
      onClick={() => {
        sendExecution(currencyPair.symbol, direction)
      }}
      priceAnnounced={rfqQuoteState.stage === QuoteStateStage.Received}
      disabled={disabled}
      isExpired={isExpired}
    />
  )
}

export const AwaitingPriceButton = () => (
  <QuotePriceLoading>
    <AdaptiveLoader size={16} />
    <Typography
      variant="Text sm/Regular"
      color="Colors/Text/text-secondary (700)"
      paddingTop="xxs"
    >
      Awaiting Price
    </Typography>
  </QuotePriceLoading>
)

export const PriceButton = ({ direction }: { direction: Direction }) => {
  const rfqState = useRfqState()

  return (
    <Stack justifyContent="center" alignItems="center">
      {rfqState.stage === QuoteStateStage.Requested ? (
        <AwaitingPriceButton />
      ) : (
        <PriceButtonContainer direction={direction} rfqQuoteState={rfqState} />
      )}
    </Stack>
  )
}

export const PriceUnavailableButton = () => (
  <PriceButtonDisabledPlaceholder
    direction="column"
    justifyContent="center"
    alignItems="center"
  >
    <ForbiddenIcon />
    <Typography variant="Text sm/Regular" color="Colors/Text/text-disabled">
      Pricing Unavailable
    </Typography>
  </PriceButtonDisabledPlaceholder>
)
