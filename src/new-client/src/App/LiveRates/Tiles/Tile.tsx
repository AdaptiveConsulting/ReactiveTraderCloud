import { memo } from "react"
import { merge } from "rxjs"
import styled from "styled-components/macro"
import { Direction } from "services/trades"
import { PriceMovement, priceMovement$ } from "./PriceMovement"
import { NotionalInput, notionalInput$ } from "./Notional"
import { AnalyticsTile, analyticsTile$ } from "./AnalyticsTile"
import { getDealtCurrency$, PriceButton, priceButton$ } from "./PriceButton"
import { TileHeader, tileHeader$ } from "./TileHeader"
import {
  MainTileStyle,
  PriceControlWrapper,
  MainTileWrapper,
  NotionalInputWrapper,
  TileBodyWrapper,
} from "./responsiveWrappers"
import { execution$ } from "services/executions"
import ExecutionStatusAlert from "./ExecutionStatusAlert"

const PanelItem = styled.div`
  flex-grow: 1;
  flex-basis: 20rem;
  position: relative;
`

const PriceControlsStyle = styled("div") <{
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
      grid-template-columns: 33% 33% 33%;
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
      notionalInput$,
      execution$,
      getDealtCurrency$
    ].map((fn) => fn(symbol)),
  )

export const Tile: React.FC<{
  symbol: string
  isAnalytics: boolean
}> = memo(({ symbol, isAnalytics }) => {
    return (
      <PanelItem>
        <MainTileWrapper shouldMoveDate={false}>
          <MainTileStyle
            className="spot-tile"
            data-qa="analytics-tile__spot-tile"
            data-qa-id={`currency-pair-${symbol.toLowerCase()}`}
          >
            <TileHeader symbol={symbol} />

            <TileBodyWrapper isAnalyticsView={isAnalytics}>
              {isAnalytics ? <AnalyticsTile symbol={symbol} /> : null}

              <PriceControlWrapper>
                <PriceControlsStyle
                  data-qa="analytics-tile-price-control__header"
                  isAnalyticsView={isAnalytics}
                >
                  <PriceMovement isAnalyticsView={isAnalytics} symbol={symbol} />
                  <PriceButton direction={Direction.Sell} symbol={symbol} />
                  <PriceButton direction={Direction.Buy} symbol={symbol} />
                </PriceControlsStyle>
              </PriceControlWrapper>

              <NotionalInputWrapper isAnalyticsView={isAnalytics}>
                <NotionalInput symbol={symbol} />
              </NotionalInputWrapper>
            </TileBodyWrapper>
          </MainTileStyle>
        </MainTileWrapper>
        <ExecutionStatusAlert symbol={symbol}/>
      </PanelItem>
    )
  })
