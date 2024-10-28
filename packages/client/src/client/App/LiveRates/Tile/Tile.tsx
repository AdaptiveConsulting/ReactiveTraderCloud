import { SUSPENSE } from "@react-rxjs/core"
import { memo } from "react"
import { merge, pipe } from "rxjs"
import { map } from "rxjs/operators"

import { isMobileDevice } from "@/client/utils"
import { Direction } from "@/generated/TradingGateway"
import { CurrencyPair } from "@/services/currencyPairs"
import { getIsSymbolDataStale$ } from "@/services/prices"

import { ExecutionResponse, executionResponse$ } from "./ExecutionResponse"
import { Header, header$ } from "./Header"
import { HistoricalGraph, historicalGraph$ } from "./HistoricalGraph"
import { NotionalInput, notionalInput$ } from "./Notional"
import { PriceButton, priceButton$ } from "./PriceButton"
import { PriceMovement, priceMovement$ } from "./PriceMovement"
import {
  getRfqState$,
  isRfq$,
  onRejectQuote,
  QuoteStateStage,
  RfqButton,
  RfqTimer,
  useRfqState,
} from "./Rfq"
import { Provider, symbolBind, useTileContext } from "./Tile.context"
import {
  Body,
  GraphPricesWrapper,
  InputTimerStyle,
  Main,
  PanelItem,
  PriceControlsStyle,
  PriceControlWrapper,
} from "./Tile.styles"

export const tile$ = (symbol: string) =>
  merge(
    [
      historicalGraph$,
      header$,
      priceMovement$,
      priceButton$(Direction.Sell),
      priceButton$(Direction.Buy),
      executionResponse$,
      getRfqState$,
      isRfq$,
      notionalInput$,
    ].map((fn) => fn(symbol)),
  )

const [useIsSymbolDataStale] = symbolBind(
  pipe(
    getIsSymbolDataStale$,
    map((isStale) => (isStale ? SUSPENSE : null)),
  ),
)

interface Props {
  isAnalytics: boolean
}

const Tile = ({ isAnalytics }: Props) => {
  useIsSymbolDataStale()
  const rfq = useRfqState()
  const {
    currencyPair: { symbol },
    supportsTearOut,
  } = useTileContext()
  const timerData =
    rfq.stage === QuoteStateStage.Received
      ? { start: rfq.payload.time, end: rfq.payload.time + rfq.payload.timeout }
      : null

  const InputTimerWrapper = ({ isAnalytics }: { isAnalytics?: boolean }) => {
    return (
      <InputTimerStyle isAnalyticsView={!!isAnalytics}>
        {timerData ? (
          <RfqTimer
            {...timerData}
            isAnalyticsView={!!isAnalytics}
            onReject={() => onRejectQuote(symbol)}
          />
        ) : null}
        <NotionalInput />
      </InputTimerStyle>
    )
  }

  return (
    <PanelItem shouldMoveDate={supportsTearOut}>
      <Main>
        <Header />
        <Body isAnalyticsView={isAnalytics} showTimer={!!timerData}>
          {isAnalytics ? (
            <GraphPricesWrapper>
              <HistoricalGraph showTimer={!!timerData} />
              <PriceControlWrapper>
                <PriceControlsStyle isAnalyticsView={isAnalytics}>
                  <PriceMovement isAnalyticsView={isAnalytics} />
                  <PriceButton direction={Direction.Sell} />
                  <PriceButton direction={Direction.Buy} />
                  <RfqButton isAnalytics={isAnalytics} />
                </PriceControlsStyle>
              </PriceControlWrapper>
            </GraphPricesWrapper>
          ) : (
            <PriceControlWrapper>
              <PriceControlsStyle isAnalyticsView={isAnalytics}>
                <PriceMovement isAnalyticsView={isAnalytics} />
                <PriceButton direction={Direction.Sell} />
                <PriceButton direction={Direction.Buy} />
                <RfqButton isAnalytics={isAnalytics} />
              </PriceControlsStyle>
            </PriceControlWrapper>
          )}
        </Body>
        <InputTimerWrapper />
      </Main>
      <ExecutionResponse />
    </PanelItem>
  )
}

const TileContext = memo(function TileContext({
  currencyPair,
  isAnalytics,
  isTornOut = false,
  supportsTearOut = true,
}: {
  currencyPair: CurrencyPair
  isAnalytics: boolean
  isTornOut?: boolean
  supportsTearOut?: boolean
}) {
  return (
    <Provider
      value={{
        currencyPair,
        isTornOut,
        supportsTearOut: supportsTearOut && !isMobileDevice,
      }}
    >
      <Tile isAnalytics={isAnalytics} />
    </Provider>
  )
})

export { TileContext as Tile }
