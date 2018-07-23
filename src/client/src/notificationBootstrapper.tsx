import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Trade } from './types'
import TradeNotification from './ui/shell/notification/TradeNotification'

declare const window: any

const dismissNotification = () => window.fin.desktop.Notification.getCurrent().close()

const handleNotificationMessage = (message: Trade) => {
  ReactDOM.render(
    <TradeNotification message={message} dismissNotification={dismissNotification} />,
    document.getElementById('root')
  )

  // send a message back to the main application - required to restore the main application window if it's minimised
  window.fin.desktop.Notification.getCurrent().sendMessageToApplication('ack')
}

export function run() {
  // OpenFin notifications API: need to define the global method onNotificationMessage
  window.onNotificationMessage = (message: Trade) => handleNotificationMessage(message)
}
