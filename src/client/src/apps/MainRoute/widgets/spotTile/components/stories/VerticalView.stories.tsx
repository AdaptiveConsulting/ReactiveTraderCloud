import React from 'react'
import { Story, Centered, analyticsTileStories } from './Initialise.stories'
import { action } from '@storybook/addon-actions'
import { ServiceConnectionStatus } from 'rt-types'
import { currencyPair, spotTileData } from '../test-resources/spotTileProps'
import { AnalyticsTile } from '../analyticsTile'

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

const updateNotional = action('updateNotional')
const resetNotional = action('resetNotional')
const executeTrade = action('executeTrade')

const rfqActions = {
  request: action('request'),
  cancel: action('cancel'),
  reject: action('reject'),
  requote: action('requote'),
  expired: action('expired'),
  reset: action('reset'),
}

analyticsTileStories.add('Default View', () => {
  return (
    <Story>
      <Centered>
        <div
          style={{
            width: '320px',
            height: '150px',
          }}
        >
          <AnalyticsTile
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
  )
})

analyticsTileStories.add('Error', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '320px',
          height: '150px',
        }}
      >
        <AnalyticsTile
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

analyticsTileStories.add('No price', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '320px',
          height: '150px',
        }}
      >
        <AnalyticsTile
          currencyPair={currencyPair}
          spotTileData={noPriceData}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          tradingDisabled={true}
          inputDisabled={true}
          rfq={rfqActions}
        />
      </div>
    </Centered>
  </Story>
))
