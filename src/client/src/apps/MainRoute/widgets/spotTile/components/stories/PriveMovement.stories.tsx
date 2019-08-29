import React from 'react'
import { stories, Story, Centered } from './Initialise.stories'
import PriceMovement from '../PriceMovement'
import { select } from '@storybook/addon-knobs'

stories.add('Price movement', () => {
  const priceMovementType = select('Direction', { Up: 'Up', Down: 'Down' }, 'Up')
  return (
    <Story>
      <Centered>
        <PriceMovement priceMovementType={priceMovementType} spread={'3.0'} />
      </Centered>
    </Story>
  )
})
