import React from 'react'
import { action } from '@storybook/addon-actions'
import { Story, Centered, spotTileStories } from './Initialise.stories'
import { ServiceConnectionStatus } from 'rt-types'
import { currencyPair, spotTileData } from '../test-resources/spotTileProps'
import SpotTile from '../SpotTile'

const executeTrade = action('executeTrade')
const updateNotional = action('updateNotional')
const resetNotional = action('resetNotional')

const rfqActions = {
  request: action('request'),
  cancel: action('cancel'),
  reject: action('reject'),
  requote: action('requote'),
  expired: action('expired'),
  reset: action('reset'),
}

spotTileStories.add('Default View', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '320px',
          height: '150px',
        }}
      >
        <SpotTile
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
      </div>
    </Centered>
  </Story>
))

const noPriceData = {
  ...spotTileData,
  price: {
    ask: 0,
    bid: 0,
    creationTimestamp: 31566750203189236,
    mid: 0,
    symbol: 'GBPJPY',
    valueDate: '',
  },
}

spotTileStories.add('No price', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '320px',
          height: '150px',
        }}
      >
        <SpotTile
          currencyPair={currencyPair}
          spotTileData={noPriceData}
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

spotTileStories.add('Error', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '320px',
          height: '150px',
        }}
      >
        <SpotTile
          currencyPair={currencyPair}
          spotTileData={spotTileData}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={true}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </div>
    </Centered>
  </Story>
))
