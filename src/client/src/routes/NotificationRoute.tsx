import React from 'react'
import { Trade } from 'rt-types'

import { ThemeProvider } from 'rt-theme'
import TradeNotification from '../shell/notification/TradeNotification'

declare const window: any

interface Message {
  tradeNotification: Trade
}

interface State {
  message: Message | null
}

export class NotificationRoute extends React.Component<{}, State> {
  state: State = {
    message: null,
  }

  componentDidMount = () => {
    console.log('Mounted')

    window.onNotificationMessage = (message: Message) => {
      this.setState({ message }, () =>
        // send a message back to the main application - required to restore the main application window if it's minimised
        fin.desktop.Notification.getCurrent().sendMessageToApplication('ack'),
      )
    }
  }

  onDismissNotification = () => fin.desktop.Notification.getCurrent().close()

  render() {
    const { message } = this.state
    return (
      message && (
        <ThemeProvider>
          <TradeNotification message={message.tradeNotification} dismissNotification={this.onDismissNotification} />
        </ThemeProvider>
      )
    )
  }
}

export default NotificationRoute
