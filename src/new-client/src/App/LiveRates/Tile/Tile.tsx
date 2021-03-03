import React, { memo } from "react"
import { merge } from "rxjs"
import { Direction } from "services/trades"
import { PriceMovement, priceMovement$ } from "./PriceMovement"
import { NotionalInput } from "./Notional"
import { HistoricalGraph, historicalGraph$ } from "./HistoricalGraph"
import { PriceButton, priceButton$ } from "./PriceButton"
import { Header, header$ } from "./Header"
import {
  PriceControlsStyle,
  PanelItem,
  Main,
  PriceControlWrapper,
  Body,
} from "./Tile.styles"
import { ExecutionResponse, executionResponse$ } from "./ExecutionResponse"

import { CurrencyPair } from "services/currencyPairs"
import { Provider } from "./Tile.context"
import {
  isRfq$,
  RfqButton,
  getRfqState$,
  useRfqState,
  QuoteState,
  RfqTimer,
} from "./Rfq"

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
    ].map((fn) => fn(symbol)),
  )

const Tile: React.FC<{
  isAnalytics: boolean
}> = ({ isAnalytics }) => {
  const rfq = useRfqState()
  const timerData =
    rfq.state === QuoteState.Received
      ? { start: rfq.payload.time, end: rfq.payload.time + rfq.payload.timeout }
      : null
  return (
    <PanelItem>
      <Main>
        <Header />
        <Body isAnalyticsView={isAnalytics} showTimer={!!timerData}>
          {isAnalytics ? <HistoricalGraph /> : null}
          <PriceControlWrapper>
            <PriceControlsStyle isAnalyticsView={isAnalytics}>
              <PriceMovement isAnalyticsView={isAnalytics} />
              <PriceButton direction={Direction.Sell} />
              <PriceButton direction={Direction.Buy} />
              <RfqButton isAnalytics={isAnalytics} />
            </PriceControlsStyle>
          </PriceControlWrapper>
          <NotionalInput isAnalytics={isAnalytics} />
          {timerData ? (
            <RfqTimer {...timerData} isAnalyticsView={isAnalytics} />
          ) : null}
        </Body>
      </Main>
      <ExecutionResponse />
    </PanelItem>
  )
}
const TileContext: React.FC<{
  currencyPair: CurrencyPair
  isAnalytics: boolean
}> = memo(({ currencyPair, isAnalytics }) => {
  return (
    <Provider value={currencyPair}>
      <Tile isAnalytics={isAnalytics} />
    </Provider>
  )
})

export { TileContext as Tile }
