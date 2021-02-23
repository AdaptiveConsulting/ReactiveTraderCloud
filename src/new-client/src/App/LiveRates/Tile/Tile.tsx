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

export const tile$ = (symbol: string) =>
  merge(
    ...[
      historicalGraph$,
      header$,
      priceMovement$,
      priceButton$(Direction.Sell),
      priceButton$(Direction.Buy),
      executionResponse$,
    ].map((fn) => fn(symbol)),
  )

export const Tile: React.FC<{
  currencyPair: CurrencyPair
  isAnalytics: boolean
}> = memo(({ currencyPair, isAnalytics }) => {
  return (
    <Provider value={currencyPair}>
      <PanelItem>
        <Main>
          <Header />
          <Body isAnalyticsView={isAnalytics}>
            {isAnalytics ? <HistoricalGraph /> : null}
            <PriceControlWrapper>
              <PriceControlsStyle isAnalyticsView={isAnalytics}>
                <PriceMovement isAnalyticsView={isAnalytics} />
                <PriceButton direction={Direction.Sell} />
                <PriceButton direction={Direction.Buy} />
              </PriceControlsStyle>
            </PriceControlWrapper>
            <NotionalInput isAnalytics={isAnalytics} />
          </Body>
        </Main>
        <ExecutionResponse />
      </PanelItem>
    </Provider>
  )
})
