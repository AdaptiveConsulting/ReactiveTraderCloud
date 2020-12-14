import React, { memo } from "react"
import { PriceControls } from "./PriceControls/PriceControls"
import { NotionalInput } from "./Notional"
import { AnalyticsTileChart } from "./AnalyticsTile/AnalyticsTileChart"
import { TileHeader } from "./TileHeader"
import {
  MainTileStyle,
  LineChartWrapper,
  PriceControlWrapper,
  MainTileWrapper,
  NotionalInputWrapper,
  TileBodyWrapper,
} from "./responsiveWrappers"
import { useCurrencyPairs } from "services/currencyPairs"
import { usePrice, useHistoricalPrices } from "services/tiles"
import { format } from "date-fns"
import { TileView, useSelectedTileView } from "services/tiles"
import styled from "styled-components/macro"

const PanelItem = styled.div`
  flex-grow: 1;
  flex-basis: 20rem;
`

interface Props {
  id: string
}

export const TilePanel: React.FC<Props> = memo(({ id }) => {
  const currentView = useSelectedTileView()
  const isAnalytics = currentView === TileView.Analytics
  const currencyPairs = useCurrencyPairs()
  const currencyPair = currencyPairs[id]
  const priceData = usePrice(id)
  const spotDate = priceData.valueDate
    ? format(new Date(priceData.valueDate), "ddMMM")
    : ""
  const date = spotDate && `SPT (${spotDate.toUpperCase()})`
  const isTimerOn = false
  const rawHistoryPrices = useHistoricalPrices(id)
  const HISTORIC_PRICES_MAX_POINTS = 100
  const startIndexUpdatePrices = Math.max(
    1,
    rawHistoryPrices.length - HISTORIC_PRICES_MAX_POINTS,
  )
  const historicPrices = rawHistoryPrices.slice(
    startIndexUpdatePrices,
    rawHistoryPrices.length,
  )
  const notional = 100000
  return (
    <PanelItem>
      <MainTileWrapper shouldMoveDate={false}>
        <MainTileStyle
          className="spot-tile"
          data-qa="analytics-tile__spot-tile"
          data-qa-id={`currency-pair-${currencyPair.symbol.toLowerCase()}`}
        >
          <TileHeader ccyPair={currencyPair} date={date} />

          <TileBodyWrapper isAnalyticsView={isAnalytics}>
            {isAnalytics ? (
              <LineChartWrapper isTimerOn={isTimerOn}>
                <AnalyticsTileChart history={historicPrices} />
              </LineChartWrapper>
            ) : null}

            <PriceControlWrapper>
              <PriceControls
                currencyPair={currencyPair}
                priceData={priceData}
              />
            </PriceControlWrapper>

            <NotionalInputWrapper isAnalyticsView={isAnalytics}>
              <NotionalInput
                notional={notional}
                currencyPairBase={currencyPair.base}
                currencyPairSymbol={currencyPair.symbol}
              />
            </NotionalInputWrapper>
          </TileBodyWrapper>
        </MainTileStyle>
      </MainTileWrapper>
    </PanelItem>
  )
})
