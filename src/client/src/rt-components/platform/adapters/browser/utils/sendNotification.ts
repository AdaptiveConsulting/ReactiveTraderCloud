import { Direction, Trade } from 'rt-types'

export enum NotifyPermission {
  granted = 'granted',
}

export interface NotificationMessage {
  tradeNotification?: Trade
}

export const sendNotification = ({ tradeNotification }: NotificationMessage) => {
  const direction = tradeNotification.direction === Direction.Buy ? 'Buy' : 'Sell'
  const status = tradeNotification.status === 'done' ? 'Accepted' : 'Rejected'
  const title = `Trade ${status} ${direction} ${tradeNotification.dealtCurrency} ${tradeNotification.notional}`
  const body = `vs. ${tradeNotification.termsCurrency} \nRate ${tradeNotification.spotRate}    Trade ID ${
    tradeNotification.tradeId
  }`

  const options = {
    body,
    icon: './static/media/adaptive-logo-without-background.png',
    dir: 'ltr',
  }

  // @ts-ignore
  const notification = new Notification(title, options)
}
