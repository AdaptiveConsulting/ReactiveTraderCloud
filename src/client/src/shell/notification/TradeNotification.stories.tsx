import { action } from '@storybook/addon-actions'
import { capitalize } from 'lodash'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { Story } from 'rt-storybook'
import { styled } from 'rt-theme'
import TradeNotification, { Props } from './TradeNotification'
import {TradeStatus} from 'rt-types'

const stories = storiesOf('Trade Notification', module)

const props: Props = {
  trade: {
    dealtCurrency: 'EUR',
    direction: 'Sell',
    notional: 1000000,
    spotRate: 133.303,
    status: TradeStatus.Rejected,
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
`

const NotificationContainer = styled('div')`
  width: 320px;
  height: 120px;
`

const getPropsByStatus:(status:TradeStatus)=>Props = (status)=>(
  {
    ...props,
    trade:{...props.trade, status}
  }
)
const tradeStatuses = [TradeStatus.Done, TradeStatus.Rejected]

tradeStatuses.map(tradeStatus =>
  stories.add(capitalize(tradeStatus), () => {
    const props = getPropsByStatus(tradeStatus)
    return (
    <Story>
      <Centered>
        <NotificationContainer>
          <TradeNotification {...props} />
        </NotificationContainer>
      </Centered>
    </Story>
  )})
  
)
