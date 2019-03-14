import React from 'react'
import { action } from '@storybook/addon-actions'
import { stories, Story, Centered } from './Initialise.stories'
import { ServiceConnectionStatus } from 'rt-types'
import { currencyPair, spotTileData } from '../test-resources/spotTileProps'
import SpotTile from '../SpotTile'

const executeTrade = action('executeTrade')
const updateNotional = action('updateNotional')
const setInErrorStatus = action('setInErrorStatus')

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
