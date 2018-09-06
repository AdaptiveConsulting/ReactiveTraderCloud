import React from 'react'
import ReactDOM from 'react-dom'
import { Trade } from 'rt-types'

import { ThemeState } from 'rt-theme'
import TradeNotification from './shell/notification/TradeNotification'

declare const window: any

const dismissNotification = () => window.fin.desktop.Notification.getCurrent().close()

interface Message {
  tradeNotification: Trade
}

const handleNotificationMessage = ({ tradeNotification }: Message) => {
  ReactDOM.render(
    <ThemeState.Provider
      name={
        // Expected global value established by the root container
        window.localStorage.themeName
      }
    >
      <TradeNotification message={tradeNotification} dismissNotification={dismissNotification} />
    </ThemeState.Provider>,
    document.getElementById('root')
  )

  // send a message back to the main application - required to restore the main application window if it's minimised
  window.fin.desktop.Notification.getCurrent().sendMessageToApplication('ack')
}

export function run() {
  // OpenFin notifications API: need to define the global method onNotificationMessage
  window.onNotificationMessage = (message: Message) => handleNotificationMessage(message)
}
