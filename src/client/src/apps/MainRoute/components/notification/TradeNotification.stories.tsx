import React from 'react'
import { action } from '@storybook/addon-actions'
import { Story, Centered } from 'rt-storybook'
import { Direction } from 'rt-types'
import { storiesOf } from '@storybook/react'
import TileNotification from 'apps/MainRoute/widgets/spotTile/components/notifications/TileNotification'
import TileExecuted from 'apps/MainRoute/widgets/spotTile/components/notifications/TileExecuted'

const stories = storiesOf('Trade Notification', module)

const onNotificationDismissedClick = action('Notification dismissed')
const currencyPair = {
  base: 'EUR',
  pipsPosition: 2,
  ratePrecision: 3,
  symbol: 'EURUSD',
  terms: 'USD',
}
const symbols = `${currencyPair.base}/${currencyPair.terms}`
const style = {
  width: '320px',
  height: '170px',
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
  status: 'rejected',
}

stories.add('Executed', () => (
  <Story>
    <Centered>
      <TileNotification
        style={style}
        isWarning={false}
        symbols={symbols}
        tradeId={trade.tradeId}
        handleClick={onNotificationDismissedClick}
      >
        <TileExecuted
          direction={trade.direction}
          dealtCurrency={trade.dealtCurrency}
          counterCurrency={currencyPair.terms}
          notional={trade.notional}
          rate={trade.spotRate}
          date={trade.valueDate}
        />
      </TileNotification>
    </Centered>
  </Story>
))

stories.add('Rejected', () => (
  <Story>
    <Centered>
      <TileNotification
        style={style}
        isWarning={true}
        symbols={symbols}
        tradeId={trade.tradeId}
        handleClick={onNotificationDismissedClick}
      >
        Your trade has been rejected
      </TileNotification>
    </Centered>
  </Story>
))

stories.add('Warning: Execution longer', () => (
  <Story>
    <Centered>
      <TileNotification style={style} symbols={symbols} isWarning={true}>
        Trade Execution taking longer then Expected
      </TileNotification>
    </Centered>
  </Story>
))

stories.add('Warning: Timeout', () => (
  <Story>
    <Centered>
      <TileNotification style={style} symbols={symbols} isWarning={true}>
        Trade execution timeout exceeded
      </TileNotification>
    </Centered>
  </Story>
))
