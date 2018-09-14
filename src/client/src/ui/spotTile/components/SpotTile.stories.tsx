import React from 'react'

import { boolean, select, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { action } from '@storybook/addon-actions'
import { Flex } from 'rt-components'
import { Story as BaseStory } from 'rt-storybook'
import { styled, ThemeProvider } from 'rt-theme'
import { Direction, ServiceConnectionStatus } from 'rt-types'
import { SpotTileData } from '../model/index'
import { PriceMovementTypes } from '../model/priceMovementTypes'
import NotionalInput from './notional'
import PriceButton from './PriceButton'
import PriceMovement from './PriceMovement'
import SpotTile from './SpotTile'
import { DeliveryDate, TileSymbol } from './styled'
import TileSwitch from './TileSwitch'

const Centered = styled('div')`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Story: React.SFC = ({ children }) => (
  <BaseStory>
    <ThemeProvider theme={theme => theme.tile}>{children}</ThemeProvider>
  </BaseStory>
)

const stories = storiesOf('Spot Tile', module)
stories.addDecorator(withKnobs)

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

stories.add('Notional input', () => (
  <Story>
    <Centered>
      <div style={{ padding: '1.5rem' }}>
        <NotionalInput notional="1,000,000" currencyPairSymbol="USD" updateNotional={action('Update notional')} />
      </div>
    </Centered>
  </Story>
))

stories.add('Delivery date', () => (
  <Story>
    <Centered>
      <div style={{ padding: '1.5rem' }}>
        <DeliveryDate>04 AUG</DeliveryDate>
      </div>
    </Centered>
  </Story>
))

stories.add('Symbol', () => (
  <Story>
    <Centered>
      <div style={{ padding: '1.5rem' }}>
        <TileSymbol>USD/JPY</TileSymbol>
      </div>
    </Centered>
  </Story>
))

const currencyPair = {
  base: 'EUR',
  pipsPosition: 2,
  ratePrecision: 3,
  symbol: 'EURUSD',
  terms: 'USD'
}

const spotTileData: Required<SpotTileData> = {
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
  },
  lastTradeExecutionStatus: null
}

const trade = {
  tradeId: 4619,
  symbol: 'GBPJPY',
  traderName: 'ESP',
  notional: 1000000,
  dealtCurrency: 'GBP',
  direction: Direction.Buy,
  spotRate: 184.672,
  tradeDate: new Date('2018-08-09T16:34:52.622Z'),
  valueDate: new Date('2018-08-13T00:00:00.000Z'),
  status: 'rejected'
}

const lastTradeExecutionStatus = {
  hasError: false,
  request: {
    CurrencyPair: 'GBPJPY',
    SpotRate: 184.672,
    Direction: Direction.Buy,
    Notional: 1000000,
    DealtCurrency: 'GBP'
  }
}

const tradeExecuted = {
  ...lastTradeExecutionStatus,
  trade: { ...trade, status: 'done' }
}

const tradeRejected = {
  ...lastTradeExecutionStatus,
  trade: { ...trade, status: 'rejected' }
}

const executeTrade = action('executeTrade')

const onNotificationDismissedClick = action('Notification dismissed')

stories.add('Tile', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '320px',
          height: '150px'
        }}
      >
        <SpotTile
          currencyPair={currencyPair}
          spotTileData={spotTileData}
          executeTrade={executeTrade}
          executionStatus={ServiceConnectionStatus.CONNECTED}
        />
      </div>
    </Centered>
  </Story>
))

stories.add('Booking', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '320px',
          height: '150px'
        }}
      >
        <TileSwitch
          onNotificationDismissed={onNotificationDismissedClick}
          currencyPair={currencyPair}
          spotTileData={{ ...spotTileData, isTradeExecutionInFlight: true }}
          executeTrade={executeTrade}
          onPopoutClick={action('On popout click')}
        />
      </div>
    </Centered>
  </Story>
))

stories.add('Executed', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '320px',
          height: '150px'
        }}
      >
        <TileSwitch
          onNotificationDismissed={onNotificationDismissedClick}
          currencyPair={currencyPair}
          spotTileData={{ ...spotTileData, lastTradeExecutionStatus: tradeExecuted }}
          executeTrade={executeTrade}
          onPopoutClick={action('On popout click')}
        />
      </div>
    </Centered>
  </Story>
))

stories.add('Rejected', () => (
  <Story>
    <Centered>
      <div
        style={{
          width: '320px',
          height: '150px'
        }}
      >
        <TileSwitch
          onNotificationDismissed={onNotificationDismissedClick}
          currencyPair={currencyPair}
          spotTileData={{ ...spotTileData, lastTradeExecutionStatus: tradeRejected }}
          executeTrade={executeTrade}
          onPopoutClick={action('On popout click')}
        />
      </div>
    </Centered>
  </Story>
))

const options = {
  Rejected: 'rejected',
  Done: 'done',
  None: 'none'
}

const tradeOptions = {
  rejected: tradeRejected,
  done: tradeExecuted,
  none: null as null
}

stories.add('Switch', () => {
  const option = select('Notification', options, 'none')
  return (
    <Story>
      <Centered>
        <div
          style={{
            width: '320px',
            height: '150px'
          }}
        >
          <TileSwitch
            onNotificationDismissed={onNotificationDismissedClick}
            currencyPair={currencyPair}
            spotTileData={{
              ...spotTileData,
              isTradeExecutionInFlight: boolean('Booking', false),
              lastTradeExecutionStatus: tradeOptions[option]
            }}
            executeTrade={executeTrade}
            onPopoutClick={action('On popout click')}
          />
        </div>
      </Centered>
    </Story>
  )
})
