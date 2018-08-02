import React from 'react'

import centered from '@storybook/addon-centered'
import { selectV2, withKnobs } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'

import { Flex } from 'rt-components'
import { Story } from 'rt-storybook'
import { Direction } from 'rt-types'
import NotionalInput from './NotionalInput'
import PriceButton from './PriceButton'
import PriceMovement from './PriceMovement'
import { DeliveryDate, TileSymbol } from './Styled'

const stories = storiesOf('Spot Tile', module).addDecorator(centered)
stories.addDecorator(withKnobs)

stories.add('Price button', () => (
  <Story>
    <Flex>
      <PriceButton direction={Direction.Buy} big="33" pip="1" tenth="22" />
      <PriceButton direction={Direction.Sell} big="34" pip="2" tenth="22" />
    </Flex>
  </Story>
))

stories.add('Price movement', () => {
  const priceMovementType = selectV2('Direction', { Up: 'Up', Down: 'Down' }, 'Up')
  return (
    <Story>
      <PriceMovement priceMovementType={priceMovementType} spread={{ formattedValue: '3.0' }} />
    </Story>
  )
})

stories.add('Notional input', () => (
  <Story>
    <div style={{ padding: '24px' }}>
      <NotionalInput
        currencyPair={{
          base: 'USD',
          pipsPosition: 2,
          ratePrecision: 3,
          symbol: 'USDJPY',
          terms: 'JPY'
        }}
      />
    </div>
  </Story>
))

stories.add('Delivery date', () => (
  <Story>
    <div style={{ padding: '24px' }}>
      <DeliveryDate date="04 AUG" />
    </div>
  </Story>
))

stories.add('Tile symbol', () => (
  <Story>
    <div style={{ padding: '24px' }}>
      <TileSymbol symbol="USD/JPY" />
    </div>
  </Story>
))
