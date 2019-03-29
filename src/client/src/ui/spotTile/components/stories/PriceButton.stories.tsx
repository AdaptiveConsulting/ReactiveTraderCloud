import React from 'react'
import PriceButton from '../PriceButton'
import { Flex } from 'rt-components'
import { Direction } from 'rt-types'

import { stories, Story, Centered } from './Initialise.stories'

stories.add('Price button', () => (
  <Story>
    <Centered>
      <Flex>
        <PriceButton direction={Direction.Buy} big={33} pip={1} tenth={22} />
        <PriceButton direction={Direction.Sell} big={33} pip={1} tenth={22} />
      </Flex>
    </Centered>
  </Story>
))
