import React from 'react'
import { action } from '@storybook/addon-actions'
import { stories, Story, Centered } from './Initialise.stories'
import { ServiceConnectionStatus } from 'rt-types'
import { currencyPair, spotTileData } from '../test-resources/spotTileProps'
import SpotTile from '../SpotTile'

const executeTrade = action('executeTrade')

stories.add('Tile', () => (
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
        />
      </div>
    </Centered>
  </Story>
))
