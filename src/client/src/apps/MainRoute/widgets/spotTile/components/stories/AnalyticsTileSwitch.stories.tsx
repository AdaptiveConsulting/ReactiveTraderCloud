import React from 'react'
import { action } from '@storybook/addon-actions'
import { boolean, select } from '@storybook/addon-knobs'
import { stories, Story, Centered } from './Initialise.stories'
import { currencyPair, spotTileDataWithRfq, switchOptions } from '../test-resources/spotTileProps'
import { AnalyticsTile } from '../analyticsTile'
import { SpotTileDataWithNotional } from '../../model'
import { ServiceConnectionStatus } from 'rt-types'

const executeTrade = action('executeTrade')
const updateNotional = action('update notional')
const resetNotional = action('resetNotional')

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
          spotTileData={{ ...spotTileDataWithRfq, rfqState: 'requested' }}
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

stories.add('AnalyticsTile RFQ timer', () => (
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
            tradingDisabled={true}
            inputDisabled={false}
            rfq={rfqActions}
          />
        </div>
      </Centered>
    </Story>
  )
})
