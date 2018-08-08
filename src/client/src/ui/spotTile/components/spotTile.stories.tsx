import React from 'react'

import centered from '@storybook/addon-centered'
import { boolean, select, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { action } from '@storybook/addon-actions'
import { Flex } from 'rt-components'
import { Story } from 'rt-storybook'
import { Direction, PriceMovementTypes } from 'rt-types'
import { TileBooking, TileNotification } from './notifications'
import NotionalInput from './notional'
import PriceButton from './PriceButton'
import PriceMovement from './PriceMovement'
import SpotTile from './SpotTile'
import { DeliveryDate, TileSymbol } from './Styled'
import TileSwitch from './TileSwitch'

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
      <NotionalInput notional="1,000,000" currencyPairSymbol="USD" updateNotional={action('Update notional')} />
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

stories.add('Symbol', () => (
  <Story>
    <div style={{ padding: '24px' }}>
      <TileSymbol>USD/JPY</TileSymbol>
    </div>
  </Story>
))

const currencyPair = {
  base: 'EUR',
  pipsPosition: 2,
  ratePrecision: 3,
  symbol: 'EURUSD',
  terms: 'USD'
}

const spotTileData = {
  currencyChartIsOpening: false,
  isTradeExecutionInFlight: false,
  price: {
    ask: 184.775,
    bid: 184.767,
    creationTimestamp: 31566750203189236,
    mid: 184.771,
    priceMovementType: PriceMovementTypes.Up,
    symbol: 'GBPJPY',
    valueDate: '2018-08-04T00:00:00Z'
  }
}

const executeTrade = action('executeTrade')

const onNotificationDismissedClick = action('Notification dismissed')

stories.add('Tile', () => (
  <Story>
    <div
      style={{
        width: '320px',
        height: '150px'
      }}
    >
      <SpotTile currencyPair={currencyPair} spotTileData={spotTileData} executeTrade={executeTrade} />
    </div>
  </Story>
))

stories.add('Switch', () => (
  <Story>
    <div
      style={{
        width: '320px',
        height: '150px'
      }}
    >
      <TileSwitch
        onNotificationDismissedClick={onNotificationDismissedClick}
        currencyPair={currencyPair}
        spotTileData={{ ...spotTileData, isTradeExecutionInFlight: boolean('Booking', false) }}
        executeTrade={executeTrade}
        onPopoutClick={action('On popout click')}
        tornOff={boolean('Torn off', false)}
      />
    </div>
  </Story>
))

stories.add('Booking', () => (
  <Story>
    <div
      style={{
        width: '320px',
        height: '150px'
      }}
    >
      <TileBooking show={true} />
      <SpotTile
        currencyPair={currencyPair}
        spotTileData={{ ...spotTileData, isTradeExecutionInFlight: true }}
        executeTrade={executeTrade}
      />
    </div>
  </Story>
))

stories.add('Error', () => (
  <Story>
    <div
      style={{
        width: '320px',
        height: '150px'
      }}
    >
      <TileNotification
        symbols={`${currencyPair.base}/${currencyPair.terms}`}
        icon="warning"
        colors={{ bg: 'accentBad', color: 'white' }}
      >
        {select(
          'Message',
          {
            Pricing: 'Pricing is unavailable',
            Timeout: 'Trade execution taking longer then expected',
            Disconnected: 'Disconnected'
          },
          'Disconnected'
        )}
      </TileNotification>
    </div>
  </Story>
))
