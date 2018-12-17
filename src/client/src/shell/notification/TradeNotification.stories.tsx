import { action } from '@storybook/addon-actions'
import { select } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { Story } from 'rt-storybook'
import { styled } from 'test-theme'
import TradeNotification, { Props } from './TradeNotification'

const stories = storiesOf('Trade Notification', module)

const props: Props = {
  message: {
    dealtCurrency: 'EUR',
    direction: 'Sell',
    notional: 1000000,
    spotRate: 133.303,
    status: select(
      'Status',
      {
        Rejected: 'rejected',
        Done: 'done',
      },
      'done',
    ),
    symbol: 'EURJPY',
    tradeDate: new Date('Thu Jul 26 2018 14:46:12 GMT-0400 (Eastern Daylight Time)'),
    tradeId: 2356,
    traderName: 'DOR',
    valueDate: new Date('Sun Jul 29 2018 20:00:00 GMT-0400 (Eastern Daylight Time)'),
    termsCurrency: 'JPY',
  },
  dismissNotification: action('Dismiss notification'),
}

const Centered = styled('div')`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: grey;
`

const NotificationContainer = styled('div')`
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
