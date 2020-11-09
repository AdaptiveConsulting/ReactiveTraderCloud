import React from 'react'
import {
  currencyPair,
  spotTileData,
  spotTileDataWithRfq,
} from 'apps/MainRoute/widgets/spotTile/components/test-resources/spotTileProps'
import { ServiceConnectionStatus } from 'rt-types/serviceStatus'
import { action } from 'rt-util/ActionHelper'
import styled from 'styled-components/macro'
import {
  BaseSpotTile,
  HoveredSpotTile,
  PriceUnavailableSpotTile,
  ExecutingSpotTile,
  PriceAnnouncedSpotTile,
  PricedSpotTile,
  PricedHoverSpotTile,
  BaseAnalyticsTile,
  HoveredAnalyticsTile,
  PriceUnavailableAnalyticsTile,
  ExecutingAnalyticsTile,
  PriceAnnouncedAnalyticsTile,
  PricedAnalyticsTile,
  PricedHoverAnalyticsTile,
} from './spotTilesMocks'
import { H3 } from '../elements'

const executeTrade = () => action('executeTrade')
const updateNotional = () => action('updateNotional')
const resetNotional = () => action('resetNotional')

const rfqActions = {
  request: action('request'),
  cancel: action('cancel'),
  reject: action('reject'),
  requote: action('requote'),
  expired: action('expired'),
  reset: action('reset'),
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 120px 320px 320px;
  grid-column-gap: 43px;
  grid-row-gap: 17px;
`
const Cell = styled.div`
  display: grid;
  grid-template-rows: 15px 175px;
  grid-row-gap: 9px;
`
const FxSpot = styled.div`
  grid-row: 1 / span 2;
`
const FxRfq = styled.div`
  grid-row: 4 / span 4;
`
const Separator = styled.hr`
  grid-column: 1 / -1;
  border: none;
  border-bottom: ${({ theme }) => `2px solid ${theme.core.primaryStyleGuideBackground}`};
  margin: 4rem 0;
`

const SpotTilesGrid = () => (
  <>
    <H3>Trading Tiles - Horizontal</H3>
    <Grid>
      <FxSpot>FX Spot</FxSpot>
      <Cell>
        <span>Normal</span>
        <BaseSpotTile
          currencyPair={currencyPair}
          spotTileData={spotTileData}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Hover</span>
        <HoveredSpotTile
          currencyPair={currencyPair}
          spotTileData={spotTileData}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Price Unavailable</span>
        <PriceUnavailableSpotTile
          currencyPair={currencyPair}
          spotTileData={spotTileData}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={true}
          inputDisabled={true}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Executing</span>
        <ExecutingSpotTile
          currencyPair={currencyPair}
          spotTileData={{ ...spotTileData, isTradeExecutionInFlight: true }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={true}
          inputDisabled={true}
          rfq={rfqActions}
        />
      </Cell>
      <Separator />
      <FxRfq>FX RFQ</FxRfq>
      <Cell>
        <span>Begin Price Request</span>
        <ExecutingSpotTile
          currencyPair={currencyPair}
          spotTileData={{ ...spotTileDataWithRfq, rfqState: 'canRequest' }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Awaiting Price</span>
        <ExecutingSpotTile
          currencyPair={currencyPair}
          spotTileData={{ ...spotTileDataWithRfq, rfqState: 'requested' }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Price Announced</span>
        <PriceAnnouncedSpotTile
          currencyPair={currencyPair}
          spotTileData={{
            ...spotTileData,
            rfqState: 'received',
            rfqTimeout: 60000,
            rfqReceivedTime: Date.now(),
          }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={true}
          rfq={rfqActions}
        />
      </Cell>

      <Cell>
        <span>Priced</span>
        <PricedSpotTile
          currencyPair={currencyPair}
          spotTileData={{
            ...spotTileData,
            rfqState: 'received',
            rfqTimeout: 60000,
            rfqReceivedTime: Date.now(),
          }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={true}
          rfq={rfqActions}
        />
      </Cell>

      <Cell>
        <span>Priced Hover</span>
        <PricedHoverSpotTile
          currencyPair={currencyPair}
          spotTileData={{
            ...spotTileData,
            rfqState: 'received',
            rfqTimeout: 60000,
            rfqReceivedTime: Date.now(),
          }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={true}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Price Expired</span>
        <ExecutingSpotTile
          currencyPair={currencyPair}
          spotTileData={{ ...spotTileDataWithRfq, rfqState: 'expired' }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </Cell>
    </Grid>
    <Separator />
    <H3>Trading Tiles - Vertical</H3>

    <Grid>
      <FxSpot>FX Spot</FxSpot>
      <Cell>
        <span>Normal</span>
        <BaseAnalyticsTile
          currencyPair={currencyPair}
          spotTileData={spotTileData}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Hover</span>
        <HoveredAnalyticsTile
          currencyPair={currencyPair}
          spotTileData={spotTileData}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Price Unavailable</span>
        <PriceUnavailableAnalyticsTile
          currencyPair={currencyPair}
          spotTileData={spotTileData}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={true}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Executing</span>
        <ExecutingAnalyticsTile
          currencyPair={currencyPair}
          spotTileData={{ ...spotTileDataWithRfq, isTradeExecutionInFlight: true }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={true}
          inputDisabled={true}
          rfq={rfqActions}
        />
      </Cell>
      <Separator />

      <FxRfq>FX RFQ</FxRfq>
      <Cell>
        <span>Begin Price Request</span>
        <ExecutingAnalyticsTile
          currencyPair={currencyPair}
          spotTileData={{ ...spotTileDataWithRfq, rfqState: 'canRequest' }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={true}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Awaiting Price</span>
        <ExecutingAnalyticsTile
          currencyPair={currencyPair}
          spotTileData={{ ...spotTileDataWithRfq, rfqState: 'requested' }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={true}
          inputDisabled={true}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Price Announced</span>
        <PriceAnnouncedAnalyticsTile
          currencyPair={currencyPair}
          spotTileData={{
            ...spotTileData,
            rfqState: 'received',
            rfqTimeout: 60000,
            rfqReceivedTime: Date.now(),
          }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={true}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Priced</span>
        <PricedAnalyticsTile
          currencyPair={currencyPair}
          spotTileData={{
            ...spotTileData,
            rfqState: 'received',
            rfqTimeout: 60000,
            rfqReceivedTime: Date.now(),
          }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={true}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Priced Hover</span>
        <PricedHoverAnalyticsTile
          currencyPair={currencyPair}
          spotTileData={{
            ...spotTileData,
            rfqState: 'received',
            rfqTimeout: 60000,
            rfqReceivedTime: Date.now(),
          }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={true}
          rfq={rfqActions}
        />
      </Cell>
      <Cell>
        <span>Price Expired</span>
        <ExecutingAnalyticsTile
          currencyPair={currencyPair}
          spotTileData={{
            ...spotTileData,
            rfqState: 'expired',
          }}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </Cell>
    </Grid>
  </>
)

export default SpotTilesGrid
