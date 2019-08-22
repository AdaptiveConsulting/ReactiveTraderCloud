import { Trade } from 'rt-types'

export enum NotifyPermission {
  granted = 'granted',
}

export interface NotificationMessage {
  tradeNotification?: Trade
}

export const sendNotification = ({ tradeNotification }: NotificationMessage) => {
  const status = tradeNotification.status === 'done' ? 'Accepted' : 'Rejected'
  const title = `Trade ${status}: ${tradeNotification.direction} ${tradeNotification.dealtCurrency} ${tradeNotification.notional}`
  const body = `vs. ${tradeNotification.termsCurrency} \nRate ${tradeNotification.spotRate}    Trade ID ${tradeNotification.tradeId}`

  const options = {
    body,
    icon: './static/media/adaptive-logo-without-background.png',
    dir: 'ltr',
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  // @ts-ignore
  const notification = new Notification(title, options)
}
