import React from 'react'
import NotionalInput from '../notional'
import { Story, Centered, notionalStories } from './Initialise.stories'
import { action } from '@storybook/addon-actions'

const updateNotional = action('updateNotional')
const resetNotional = action('resetNotional')

notionalStories.add('Notional input', () => (
  <Story>
    <Centered>
      <div style={{ padding: '1.5rem' }}>
        <NotionalInput
          notional={0}
          currencyPairSymbol="USDJPY"
          currencyPairBase="USD"
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          disabled={false}
        />
      </div>
    </Centered>
  </Story>
))

notionalStories.add('Notional input with trading disabled', () => (
  <Story>
    <Centered>
      <div style={{ padding: '1.5rem' }}>
        <NotionalInput
          notional={1000000000}
          currencyPairSymbol="USDJPY"
          currencyPairBase="USD"
          updateNotional={updateNotional}
          resetNotional={resetNotional}
          disabled={true}
        />
      </div>
    </Centered>
  </Story>
))
