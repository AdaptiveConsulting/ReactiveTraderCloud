import React from 'react'
import NotionalInput from '../notional'
import { stories, Story, Centered } from './Initialise.stories'
import { action } from '@storybook/addon-actions'

stories.add('Notional input', () => (
  <Story>
    <Centered>
      <div style={{ padding: '1.5rem' }}>
        <NotionalInput notional="1,000,000" currencyPairSymbol="USD" updateNotional={action('Update notional')} />
      </div>
    </Centered>
  </Story>
))
