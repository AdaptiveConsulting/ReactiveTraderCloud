import React from 'react'
import { stories, Story, Centered } from './Initialise.stories'
import { action } from '@storybook/addon-actions'
import { ServiceConnectionStatus } from 'rt-types'
import { currencyPair, spotTileData } from '../test-resources/spotTileProps'
import { AnalyticsTile } from '../analyticsTile'

const updateNotional = action('updateNotional')
const executeTrade = action('executeTrade')
const setDisabledTradingState = action('setDisabledTradingState')

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
          setDisabledTradingState={setDisabledTradingState}
          disabled={false}
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
          setDisabledTradingState={setDisabledTradingState}
          disabled={true}
        />
      </div>
    </Centered>
  </Story>
))
