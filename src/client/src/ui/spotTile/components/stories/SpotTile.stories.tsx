import React from 'react'
import { action } from '@storybook/addon-actions'
import { stories, Story, Centered } from './Initialise.stories'
import { ServiceConnectionStatus } from 'rt-types'
import { currencyPair, spotTileData } from '../test-resources/spotTileProps'
import SpotTile from '../SpotTile'

const executeTrade = action('executeTrade')
const updateNotional = action('updateNotional')

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
          canExecute={true}
        />
      </div>
    </Centered>
  </Story>
))
