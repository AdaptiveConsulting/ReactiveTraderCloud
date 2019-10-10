import React from 'react'
import { action } from '@storybook/addon-actions'
import { stories, Story, Centered } from './Initialise.stories'
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

stories.add('SpotTile', () => (
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
          inputValidationMessage={null}
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

stories.add('SpotTile no price', () => (
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
          inputValidationMessage={null}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </div>
    </Centered>
  </Story>
))

stories.add('SpotTile in error', () => (
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
          inputValidationMessage={null}
          inputDisabled={false}
          rfq={rfqActions}
        />
      </div>
    </Centered>
  </Story>
))
