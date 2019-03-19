import React from 'react'
import NotionalInput from '../notional'
import { stories, Story, Centered } from './Initialise.stories'
import { action } from '@storybook/addon-actions'

const updateNotional = action('updateNotional')

stories.add('Notional input', () => (
  <Story>
    <Centered>
      <div style={{ padding: '1.5rem' }}>
        <NotionalInput
          notional="1,000,000"
          currencyPairSymbol="USD"
          updateNotional={updateNotional}
          validationMessage={null}
        />
      </div>
    </Centered>
  </Story>
))

stories.add('Notional input with trading disabled', () => (
  <Story>
    <Centered>
      <div style={{ padding: '1.5rem' }}>
        <NotionalInput
          notional="1,000,000"
          currencyPairSymbol="USD"
          updateNotional={updateNotional}
          validationMessage={null}
        />
      </div>
    </Centered>
  </Story>
))
