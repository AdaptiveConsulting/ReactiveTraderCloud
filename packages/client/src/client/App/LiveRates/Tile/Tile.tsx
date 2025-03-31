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
import { symbolBind, TileContext, useTileContext } from "./Tile.context"
import {
  Body,
  InputTimerStyle,
  Main,
  PanelItem,
  PriceControlsStyle,
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

const TileInner = () => {
  useIsSymbolDataStale()
  const rfq = useRfqState()

  const {
    currencyPair: { symbol },
    supportsTearOut,
    showingChart,
  } = useTileContext()

  const timerData =
    rfq.stage === QuoteStateStage.Received
      ? { start: rfq.payload.time, end: rfq.payload.time + rfq.payload.timeout }
      : null

  const InputTimerWrapper = ({ isAnalytics }: { isAnalytics?: boolean }) => {
    return (
      <InputTimerStyle>
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
        <Body>
          {showingChart ? <HistoricalGraph showTimer={!!timerData} /> : null}
          <PriceControlsStyle>
            <PriceButton direction={Direction.Sell} />
            <PriceMovement />
            <PriceButton direction={Direction.Buy} />
            <RfqButton />
          </PriceControlsStyle>
        </Body>
        <InputTimerWrapper />
      </Main>
      <ExecutionResponse />
    </PanelItem>
  )
}

export const Tile = memo(function Tile({
  currencyPair,
  showingChart,
  isTornOut = false,
  supportsTearOut = true,
}: {
  currencyPair: CurrencyPair
  showingChart: boolean
  isTornOut?: boolean
  supportsTearOut?: boolean
}) {
  return (
    <TileContext.Provider
      value={{
        currencyPair,
        isTornOut,
        supportsTearOut: supportsTearOut && !isMobileDevice,
        showingChart: showingChart,
      }}
    >
      <TileInner />
    </TileContext.Provider>
  )
})
