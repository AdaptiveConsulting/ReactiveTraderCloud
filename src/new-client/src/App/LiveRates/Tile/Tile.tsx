import { memo } from "react"
import { merge, pipe } from "rxjs"
import { Direction } from "@/services/trades"
import { PriceMovement, priceMovement$ } from "./PriceMovement"
import { NotionalInput, notionalInput$ } from "./Notional"
import { HistoricalGraph, historicalGraph$ } from "./HistoricalGraph"
import { PriceButton, priceButton$ } from "./PriceButton"
import { Header, header$ } from "./Header"
import { DraggableTileTearOut } from "@/components/DraggableTearOut"
import { useRef } from "react"
import {
  Body,
  InputTimerStyle,
  Main,
  PanelItem,
  PriceControlsStyle,
  PriceControlWrapper,
  GraphNotionalWrapper,
} from "./Tile.styles"
import { ExecutionResponse, executionResponse$ } from "./ExecutionResponse"

import { CurrencyPair } from "services/currencyPairs"
import { Provider, symbolBind, useTileContext } from "./Tile.context"
import {
  getRfqState$,
  isRfq$,
  onRejectQuote,
  QuoteStateStage,
  RfqButton,
  RfqTimer,
  useRfqState,
} from "./Rfq"
import { getIsSymbolDataStale$ } from "@/services/prices"
import { SUSPENSE } from "@react-rxjs/core"
import { map } from "rxjs/operators"
import { isMobileDevice } from "@/utils"

export const tile$ = (symbol: string) =>
  merge(
    ...[
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

const Tile: React.FC<Props> = ({ isAnalytics }) => {
  useIsSymbolDataStale()
  const rfq = useRfqState()
  const ref = useRef<HTMLDivElement>(null)
  const {
    currencyPair: { symbol },
    isTornOut,
    supportsTearOut,
  } = useTileContext()
  const timerData =
    rfq.stage === QuoteStateStage.Received
      ? { start: rfq.payload.time, end: rfq.payload.time + rfq.payload.timeout }
      : null

  const InputTimerWrapper: React.FC<{ isAnalytics?: boolean }> = ({
    isAnalytics,
  }) => {
    return (
      <InputTimerStyle isAnalyticsView={!!isAnalytics}>
        <NotionalInput />
        {timerData ? (
          <RfqTimer
            {...timerData}
            isAnalyticsView={!!isAnalytics}
            onReject={() => onRejectQuote(symbol)}
          />
        ) : null}
      </InputTimerStyle>
    )
  }

  return (
    <DraggableTileTearOut symbol={symbol} tileRef={ref} disabled={isTornOut}>
      <PanelItem shouldMoveDate={supportsTearOut}>
        <Main>
          <Header />
          <Body isAnalyticsView={isAnalytics} showTimer={!!timerData}>
            {isAnalytics ? (
              <GraphNotionalWrapper>
                <HistoricalGraph showTimer={!!timerData} />
                <InputTimerWrapper isAnalytics />
              </GraphNotionalWrapper>
            ) : null}
            <PriceControlWrapper>
              <PriceControlsStyle isAnalyticsView={isAnalytics}>
                <PriceMovement isAnalyticsView={isAnalytics} />
                <PriceButton direction={Direction.Sell} />
                <PriceButton direction={Direction.Buy} />
                <RfqButton isAnalytics={isAnalytics} />
              </PriceControlsStyle>
            </PriceControlWrapper>
            {!isAnalytics ? <InputTimerWrapper /> : null}
          </Body>
        </Main>
        <ExecutionResponse />
      </PanelItem>
    </DraggableTileTearOut>
  )
}

const TileContext: React.FC<{
  currencyPair: CurrencyPair
  isAnalytics: boolean
  isTornOut?: boolean
  supportsTearOut?: boolean
}> = memo(
  ({
    currencyPair,
    isAnalytics,
    isTornOut = false,
    supportsTearOut = true,
  }) => {
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
  },
)

export { TileContext as Tile }
