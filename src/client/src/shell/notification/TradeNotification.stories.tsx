import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { Story } from 'rt-storybook'
import { styled } from 'rt-util'
import TradeNotification, { Props } from './_TradeNotification'

const stories = storiesOf('Trade Notification', module)

const props: Props = {
  message: {
    dealtCurrency: 'EUR',
    direction: 'Sell',
    notional: 1000000,
    spotRate: 133.303,
    status: 'done',
    symbol: 'EURJPY',
    tradeDate: new Date('Thu Jul 26 2018 14:46:12 GMT-0400 (Eastern Daylight Time)'),
    tradeId: 2356,
    traderName: 'DOR',
    valueDate: new Date('Sun Jul 29 2018 20:00:00 GMT-0400 (Eastern Daylight Time)'),
    termsCurrency: 'JPY'
  },
  dismissNotification: action('Dismiss notification')
}

const Centered = styled('div')`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NotificationContainer = styled('div')`
  height: 120px;
  width: 360px;
`

stories.add('Default', () => (
  <Story>
    <Centered>
      <NotificationContainer>
        <TradeNotification {...props} />
      </NotificationContainer>
    </Centered>
  </Story>
))
