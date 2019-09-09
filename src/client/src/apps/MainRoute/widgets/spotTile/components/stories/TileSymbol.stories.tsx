import React from 'react'
import { stories, Story, Centered } from './Initialise.stories'
import { TileSymbol } from '../styled'

stories.add('Symbol', () => (
  <Story>
    <Centered>
      <div style={{ padding: '1.5rem' }}>
        <TileSymbol>USD/JPY</TileSymbol>
      </div>
    </Centered>
  </Story>
))
