import React from 'react'
import { action } from '@storybook/addon-actions'
import { boolean, select } from '@storybook/addon-knobs'
import { Story, Centered, spotTileStories } from './Initialise.stories'
import SpotTile from '../SpotTile'
import { ServiceConnectionStatus } from 'rt-types'
import { currencyPair, spotTileDataWithRfq, switchOptions } from '../test-resources/spotTileProps'
import { SpotTileData } from '../../model'

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

spotTileStories.add('Booking status', () => (
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
          spotTileData={{ ...spotTileDataWithRfq, isTradeExecutionInFlight: true }}
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

spotTileStories.add('Initiate RFQ', () => (
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
          spotTileData={{ ...spotTileDataWithRfq, rfqState: 'canRequest' }}
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

spotTileStories.add('Cancel RFQ', () => (
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
          spotTileData={{ ...spotTileDataWithRfq, rfqState: 'requested' }}
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

spotTileStories.add('RFQ timer', () => (
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
          spotTileData={{
            ...spotTileDataWithRfq,
            rfqState: 'received',
            rfqTimeout: 10000,
            rfqReceivedTime: Date.now(),
          }}
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

spotTileStories.add('Requote', () => (
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
          spotTileData={{ ...spotTileDataWithRfq, rfqState: 'expired' }}
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

spotTileStories.add('RFQ Switch', () => {
  const rfqStatesSwitch = select('states', switchOptions, 'canRequest')
  return (
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
            spotTileData={
              {
                ...spotTileDataWithRfq,
                rfqState: rfqStatesSwitch,
                isTradeExecutionInFlight: boolean('Booking', false),
              } as SpotTileData
            }
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
  )
})
