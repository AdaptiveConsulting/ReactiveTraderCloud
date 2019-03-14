import React from 'react'
import { stories, Story, Centered } from './Initialise.stories'
import { action } from '@storybook/addon-actions'
import { ServiceConnectionStatus } from 'rt-types'
import { currencyPair, spotTileData } from '../test-resources/spotTileProps'
import { AnalyticsTile } from '../analyticsTile'

const updateNotional = action('updateNotional')
const executeTrade = action('executeTrade')
const setInErrorStatus = action('setInErrorStatus')

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
          setInErrorStatus={setInErrorStatus}
          canExecute={true}
          inError={false}
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
          setInErrorStatus={setInErrorStatus}
          canExecute={true}
          inError={true}
        />
      </div>
    </Centered>
  </Story>
))
