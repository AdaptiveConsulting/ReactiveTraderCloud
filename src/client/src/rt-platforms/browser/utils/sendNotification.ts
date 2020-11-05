import { Trade } from 'rt-types'

export enum NotifyPermission {
  granted = 'granted',
}

export interface NotificationMessage {
  tradeNotification: Trade
}

let registration: ServiceWorkerRegistration
navigator.serviceWorker && navigator.serviceWorker.ready.then(x => {
  registration = x;
})

export const sendNotification = ({ tradeNotification }: NotificationMessage) => {
  const status = tradeNotification.status === 'done' ? 'Accepted' : 'Rejected'
  const title = `Trade ${status}: ${tradeNotification.direction} ${tradeNotification.dealtCurrency} ${tradeNotification.notional}`
  const body = `vs. ${tradeNotification.termsCurrency} \nRate ${tradeNotification.spotRate}    Trade ID ${tradeNotification.tradeId}`

  const options = {
    body: body,
    icon: './static/media/reactive-trader.ico',
    dir: 'ltr',
    requireInteraction: true,
    actions: [
      {action: 'highlight-trade', title: 'Highlight in blotter'}
    ],
    data: tradeNotification
  }
  
  registration.showNotification(title, options as NotificationOptions)
}
