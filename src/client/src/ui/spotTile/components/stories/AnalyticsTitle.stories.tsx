import React from 'react'
import { stories, Story, Centered } from './Initialise.stories'
import { action } from '@storybook/addon-actions'
import { ServiceConnectionStatus } from 'rt-types'
import { currencyPair, spotTileData } from '../test-resources/spotTileProps'
import { AnalyticsTile } from '../analyticsTile'

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

stories.add('AnalyticsTile', () => (
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
          notional="1,000,000"
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

stories.add('AnalyticsTile in error', () => (
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
          notional="1,000,000"
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
