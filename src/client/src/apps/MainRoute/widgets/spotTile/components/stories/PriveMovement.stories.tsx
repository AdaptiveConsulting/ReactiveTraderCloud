import React from 'react'
import { stories, Story, Centered } from './Initialise.stories'
import PriceMovement from '../PriceMovement'
import { select, boolean } from '@storybook/addon-knobs'

stories.add('Price movement', () => {
  const priceMovementType = select('Direction', { Up: 'Up', Down: 'Down' }, 'Up')
  const showPriceMovement = boolean('show price movement', true)
  const isAnalyticsView = boolean('Analytic View', true)
  return (
    <Story>
      <Centered>
        <PriceMovement
          priceMovementType={priceMovementType}
          spread={'3.0'}
          show={showPriceMovement}
          isAnalyticsView={isAnalyticsView}
        />
      </Centered>
    </Story>
  )
})
