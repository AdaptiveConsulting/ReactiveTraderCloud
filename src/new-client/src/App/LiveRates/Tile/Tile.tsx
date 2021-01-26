import React, { memo } from "react"
import { merge } from "rxjs"
import styled from "styled-components/macro"
import { Direction } from "services/trades"
import { PriceMovement, priceMovement$ } from "./PriceMovement"
import { NotionalInput } from "./Notional"
import { AnalyticsTile, analyticsTile$ } from "./AnalyticsTile"
import { PriceButton, priceButton$ } from "./PriceButton"
import { TileHeader, tileHeader$ } from "./TileHeader"
import {
  MainTileStyle,
  PriceControlWrapper,
  MainTileWrapper,
  NotionalInputWrapper,
  TileBodyWrapper,
} from "./responsiveWrappers"
import ExecutionResponse from "./ExecutionResponse"
import { CurrencyPair } from "services/currencyPairs"
import { Provider } from "./context"

const PanelItem = styled.div`
  flex-grow: 1;
  flex-basis: 20rem;
  position: relative;
`

const PriceControlsStyle = styled("div")<{
  isAnalyticsView: boolean
}>`
  display: grid;
  ${({ isAnalyticsView }) =>
    isAnalyticsView
      ? `
      grid-template-columns: 20% 80%;
      grid-template-rows: 50% 50%;
      grid-template-areas: 
      "movement sell"
      "movement buy";
    `
      : `
      grid-template-columns: 37% 26% 37%;
      grid-template-rows: 100%;
      grid-template-areas: 
      "sell movement buy";
    `}
`

export const tile$ = (symbol: string) =>
  merge(
    ...[
      analyticsTile$,
      tileHeader$,
      priceMovement$,
      priceButton$(Direction.Sell),
      priceButton$(Direction.Buy),
    ].map((fn) => fn(symbol)),
  )

export const Tile: React.FC<{
  currencyPair: CurrencyPair
  isAnalytics: boolean
}> = memo(({ currencyPair, isAnalytics }) => {
  return (
    <Provider value={currencyPair}>
      <PanelItem>
        <MainTileWrapper>
          <MainTileStyle>
            <TileHeader />
            <TileBodyWrapper isAnalyticsView={isAnalytics}>
              {isAnalytics ? <AnalyticsTile /> : null}

              <PriceControlWrapper>
                <PriceControlsStyle isAnalyticsView={isAnalytics}>
                  <PriceMovement isAnalyticsView={isAnalytics} />
                  <PriceButton direction={Direction.Sell} />
                  <PriceButton direction={Direction.Buy} />
                </PriceControlsStyle>
              </PriceControlWrapper>

              <NotionalInputWrapper isAnalyticsView={isAnalytics}>
                <NotionalInput />
              </NotionalInputWrapper>
            </TileBodyWrapper>
          </MainTileStyle>
        </MainTileWrapper>
        <ExecutionResponse />
      </PanelItem>
    </Provider>
  )
})
