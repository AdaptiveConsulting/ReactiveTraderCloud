import React from 'react'

import centered from '@storybook/addon-centered'
import { storiesOf } from '@storybook/react'

import { Flex } from 'rt-components'
import { Story } from 'rt-storybook'
import { Direction } from 'rt-types'
import { PriceButton } from './spotTile2'

const stories = storiesOf('Spot Tile', module).addDecorator(centered)

stories.add('spotTile', () => (
  <Story>
    <Flex>
      <PriceButton direction={Direction.Buy} big="33" pip="1" tenth="22" />
      <PriceButton direction={Direction.Sell} big="34" pip="2" tenth="22" />
    </Flex>
  </Story>
))
