import { Trade } from 'rt-types'

export enum NotifyPermission {
  granted = 'granted',
}

export interface NotificationMessage {
  tradeNotification: Trade
}

let registration: ServiceWorkerRegistration
navigator.serviceWorker &&
  navigator.serviceWorker.ready.then(reg => {
    registration = reg
  })

export const getTradeNotificationContents = (tradeNotification : Trade): { title: string, body: string } => {
  const status = tradeNotification.status === 'done' ? 'Accepted' : 'Rejected'
  const title = `Trade ${status}: ID ${tradeNotification.tradeId}`
  const body = `${tradeNotification.direction} ${tradeNotification.dealtCurrency} ${tradeNotification.notional} vs ${tradeNotification.termsCurrency} @ ${tradeNotification.spotRate}`
  return {
    title,
    body
  }
}

export const sendNotification = ({ tradeNotification }: NotificationMessage) => {
  const { title, body } = getTradeNotificationContents(tradeNotification);
  const icon =
    navigator.userAgent.indexOf('Chrome') !== -1 && navigator.userAgent.indexOf('Win') !== -1
      ? './static/media/reactive-trader-icon-no-bkgd-256x256.png'
      : './static/media/reactive-trader-icon-dark-256x256.png' // MacOS & Firefox notifications have white backgrounds, so use dark backgrounded icon

  const options: NotificationOptions = {
    body: body,
    icon: icon,
    dir: 'ltr',
    data: tradeNotification,
  }

  if (registration) {
    registration.showNotification(title, options)
  } else {
    delete options.actions
    // eslint-disable-next-line
    const notification = new Notification(title, options)
  }
}
