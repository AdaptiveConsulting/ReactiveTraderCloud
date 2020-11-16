import React from 'react'
import { componentStories, Story, Centered } from './Initialise.stories'
import { DeliveryDate } from '../styled'

componentStories.add('Delivery date', () => (
  <Story>
    <Centered>
      <div style={{ padding: '1.5rem' }}>
        <DeliveryDate>04 AUG</DeliveryDate>
      </div>
    </Centered>
  </Story>
))
