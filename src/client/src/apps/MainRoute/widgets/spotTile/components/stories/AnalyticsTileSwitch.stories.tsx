import React from 'react'
import { action } from '@storybook/addon-actions'
import { boolean, select } from '@storybook/addon-knobs'
import { stories, Story, Centered } from './Initialise.stories'
import { currencyPair, generateHistoricPrices } from '../test-resources/spotTileProps'
import { AnalyticsTile } from '../analyticsTile'
import { PriceMovementTypes } from '../../model/priceMovementTypes'
import { SpotTileDataWithNotional } from '../../model'
import { ServiceConnectionStatus } from 'rt-types'

const executeTrade = action('executeTrade')
const updateNotional = action('update notional')
const resetNotional = action('resetNotional')

const switchOptions = {
  canRequest: 'canRequest',
  requested: 'requested',
  expired: 'expired',
  none: 'none',
}
const spotTileDataWithRfq = {
  notional: 100000000,
  isTradeExecutionInFlight: false,
  price: {
    ask: 184.775,
    bid: 184.767,
    creationTimestamp: 31566750203189236,
    mid: 184.771,
    priceMovementType: PriceMovementTypes.Up,
    symbol: 'GBPJPY',
    valueDate: '2018-08-04T00:00:00Z',
  },
  historicPrices: generateHistoricPrices(50),
  rfqState: 'none',
  rfqPrice: null,
  rfqReceivedTime: null,
  rfqTimeout: null,
  lastTradeExecutionStatus: null,
}

const rfqActions = {
  request: action('request'),
  cancel: action('cancel'),
  reject: action('reject'),
  requote: action('requote'),
  expired: action('expired'),
  reset: action('reset'),
}

stories.add('AnalyticsTile Booking status', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '340px',
          height: '150px',
        }}
      >
        <AnalyticsTile
          currencyPair={currencyPair}
          spotTileData={
            { ...spotTileDataWithRfq, isTradeExecutionInFlight: true } as SpotTileDataWithNotional
          }
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </div>
    </Centered>
  </Story>
))

stories.add('AnalyticsTile Initiate RFQ', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '340px',
          height: '150px',
        }}
      >
        <AnalyticsTile
          currencyPair={currencyPair}
          spotTileData={
            { ...spotTileDataWithRfq, rfqState: 'canRequest' } as SpotTileDataWithNotional
          }
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </div>
    </Centered>
  </Story>
))

stories.add('AnalyticsTile Cancel RFQ', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '340px',
          height: '150px',
        }}
      >
        <AnalyticsTile
          currencyPair={currencyPair}
          spotTileData={
            { ...spotTileDataWithRfq, rfqState: 'requested' } as SpotTileDataWithNotional
          }
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </div>
    </Centered>
  </Story>
))

stories.add('AnalyticsTile Requote', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '340px',
          height: '150px',
        }}
      >
        <AnalyticsTile
          currencyPair={currencyPair}
          spotTileData={{ ...spotTileDataWithRfq, rfqState: 'expired' } as SpotTileDataWithNotional}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={false}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </div>
    </Centered>
  </Story>
))

stories.add('AnalyticsTile RFQ Switch', () => {
  const rfqStatesSwitch = select('states', switchOptions, 'canRequest')
  return (
    <Story>
      <Centered>
        <div
          style={{
            width: '340px',
            height: '150px',
          }}
        >
          <AnalyticsTile
            currencyPair={currencyPair}
            spotTileData={
              {
                ...spotTileDataWithRfq,
                rfqState: rfqStatesSwitch,
                isTradeExecutionInFlight: boolean('Booking', false),
              } as SpotTileDataWithNotional
            }
            executeTrade={executeTrade}
            executionStatus={ServiceConnectionStatus.CONNECTED}
            updateNotional={updateNotional}
            resetNotional={resetNotional}
            tradingDisabled={false}
            inputDisabled={false}
            rfq={rfqActions}
          />
        </div>
      </Centered>
    </Story>
  )
})
