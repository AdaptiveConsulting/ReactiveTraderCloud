import React from 'react'
import { Trade } from 'rt-types'

import { ThemeProvider } from 'rt-theme'
import TradeNotification from '../shell/notification/TradeNotification'
import { openFinNotifications } from 'rt-components'

interface Message {
  tradeNotification: Trade
}

interface State {
  message: Message | null
}

const debugTrade: Trade = {
  tradeId: 1,
  traderName: 'Test',
  symbol: 'TST',
  notional: 100,
  dealtCurrency: 'USD',
  direction: 'BUY',
  spotRate: 101,
  tradeDate: new Date(),
  valueDate: new Date(),
  status: 'PENDING',
}

export class NotificationRoute extends React.Component<{}, State> {
  state: State = {
    message: null,
  }

  componentDidMount = () => {
    if (typeof fin !== 'undefined') {
      if (openFinNotifications.length > 0) {
        const message = openFinNotifications.pop()
        this.setState({ message }, () =>
          // send a message back to the main application - required to restore the main application window if it's minimised
          fin.desktop.Notification.getCurrent().sendMessageToApplication('ack'),
        )
      }
    }
  }

  onDismissNotification = () => fin.desktop.Notification.getCurrent().close()

  render() {
    const { message } = this.state
    return message ? (
      <ThemeProvider>
        <TradeNotification message={message.tradeNotification} dismissNotification={this.onDismissNotification} />
      </ThemeProvider>
    ) : (
      <ThemeProvider>
        <TradeNotification message={debugTrade} dismissNotification={() => console.log('Dismiss notification')} />
      </ThemeProvider>
    )
  }
}

export default NotificationRoute
