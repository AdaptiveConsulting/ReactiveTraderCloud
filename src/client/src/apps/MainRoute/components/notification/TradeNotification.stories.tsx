import React from 'react'
import { action } from '@storybook/addon-actions'
import { Story, Centered } from 'rt-storybook'
import { storiesOf } from '@storybook/react'
import TileNotification, {
  NotificationType,
} from 'apps/MainRoute/widgets/spotTile/components/notifications/TileNotification'
import TileExecuted from 'apps/MainRoute/widgets/spotTile/components/notifications/TileExecuted'
import {
  currencyPair,
  trade,
} from 'apps/MainRoute/widgets/spotTile/components/test-resources/spotTileProps'

const stories = storiesOf('Trade Notification', module)

const onNotificationDismissedClick = action('Notification dismissed')
const symbols = `${currencyPair.base}/${currencyPair.terms}`
const style = {
  width: '320px',
  height: '170px',
}

stories.add('Executed', () => (
  <Story>
    <Centered>
      <TileNotification
        style={style}
        symbols={symbols}
        tradeId={trade.tradeId}
        handleClick={onNotificationDismissedClick}
        type={NotificationType.Success}
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
        symbols={symbols}
        tradeId={trade.tradeId}
        handleClick={onNotificationDismissedClick}
        type={NotificationType.Error}
      >
        Your trade has been rejected
      </TileNotification>
    </Centered>
  </Story>
))

stories.add('Warning: Execution longer', () => (
  <Story>
    <Centered>
      <TileNotification style={style} symbols={symbols} type={NotificationType.Warning}>
        Trade execution taking longer than expected
      </TileNotification>
    </Centered>
  </Story>
))

stories.add('Warning: Timeout', () => (
  <Story>
    <Centered>
      <TileNotification style={style} symbols={symbols} type={NotificationType.Warning}>
        Trade execution timeout exceeded
      </TileNotification>
    </Centered>
  </Story>
))
