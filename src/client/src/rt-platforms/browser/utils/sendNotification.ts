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

export const sendNotification = ({ tradeNotification }: NotificationMessage) => {
  const status = tradeNotification.status === 'done' ? 'Accepted' : 'Rejected'
  const title = `Trade ${status}: ${tradeNotification.direction} ${tradeNotification.dealtCurrency} ${tradeNotification.notional}`
  const body = `vs. ${tradeNotification.termsCurrency} \nRate ${tradeNotification.spotRate}    Trade ID ${tradeNotification.tradeId}`

  const options: NotificationOptions = {
    body: body,
    icon: './static/media/reactive-trader.ico',
    dir: 'ltr',
    requireInteraction: true,
    actions: [{ action: 'highlight-trade', title: 'Highlight in blotter' }],
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
