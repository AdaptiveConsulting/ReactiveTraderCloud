import React from 'react'

import centered from '@storybook/addon-centered'
import { select, withKnobs } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'

import { action } from '@storybook/addon-actions'
import { Flex } from 'rt-components'
import { Story } from 'rt-storybook'
import { Direction, PriceMovementTypes } from 'rt-types'
import SpotTile from './_SpotTile'
import NotionalInput from './NotionalInput'
import PriceButton from './PriceButton'
import PriceMovement from './PriceMovement'
import { DeliveryDate, TileSymbol } from './Styled'

const stories = storiesOf('Spot Tile', module).addDecorator(centered)
stories.addDecorator(withKnobs)

stories.add('Price button', () => (
  <Story>
    <Flex>
      <PriceButton direction={Direction.Buy} big={33} pip={1} tenth={22} />
      <PriceButton direction={Direction.Sell} big={33} pip={1} tenth={22} />
    </Flex>
  </Story>
))

stories.add('Price movement', () => {
  const priceMovementType = select('Direction', { Up: 'Up', Down: 'Down' }, 'Up')
  return (
    <Story>
      <PriceMovement priceMovementType={priceMovementType} spread={'3.0'} />
    </Story>
  )
})

stories.add('Notional input', () => (
  <Story>
    <div style={{ padding: '24px' }}>
      <NotionalInput currencyPairSymbol="USD" />
    </div>
  </Story>
))

stories.add('Delivery date', () => (
  <Story>
    <div style={{ padding: '24px' }}>
      <DeliveryDate>04 AUG</DeliveryDate>
    </div>
  </Story>
))

stories.add('Tile symbol', () => (
  <Story>
    <div style={{ padding: '24px' }}>
      <TileSymbol>USD/JPY</TileSymbol>
    </div>
  </Story>
))

stories.add('Spot tile', () => (
  <Story>
    <div
      style={{
        width: '320px',
        height: '150px'
      }}
    >
      <SpotTile
        currencyPair={{
          base: 'USD',
          pipsPosition: 2,
          ratePrecision: 3,
          symbol: 'USDJPY',
          terms: 'JPY'
        }}
        spotTileData={{
          currencyChartIsOpening: false,
          isTradeExecutionInFlight: false,
          hasError: false,
          price: {
            ask: 184.775,
            bid: 184.767,
            creationTimestamp: 31566750203189236,
            mid: 184.771,
            priceMovementType: PriceMovementTypes.Up,
            symbol: 'GBPJPY',
            valueDate: '2018-08-04T00:00:00Z'
          }
        }}
        executeTrade={action('executeTrade')}
      />
    </div>
  </Story>
))
