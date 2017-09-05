import * as ReactDOM from 'react-dom'
import * as React from 'react'
import TradeNotification from './ui/notification/TradeNotification'

declare const window: any

export default class NotificationBootstrapper{

  run() {
    // OpenFin notifications API: need to define the global method onNotificationMessage
    window.onNotificationMessage = message => this.handleNotificationMessage(message)
  }

  dismissNotification() {
    window.fin.desktop.Notification.getCurrent().close()
  }

  handleNotificationMessage(message) {
    ReactDOM.render(<TradeNotification message={message} dismissNotification={this.dismissNotification}/>, document.getElementById('root'))

    // send a message back to the main application - required to restore the main application window if it's minimised
    window.fin.desktop.Notification.getCurrent().sendMessageToApplication('ack')
  }
}

new NotificationBootstrapper().run()
