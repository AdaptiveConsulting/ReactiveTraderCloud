import { Direction, Trade } from 'rt-types'

export const sendNotification = (trade: Trade) => {
  const direction = trade.direction === Direction.Buy ? 'Bought' : 'Sold'

  const title = `${direction.toUpperCase()} ${trade.dealtCurrency} ${trade.notional}`
  const body = `vs. ${trade.termsCurrency} \n\nRate ${trade.spotRate}    Trade ID ${trade.tradeId}`

  const options = {
    body,
    icon: './static/media/adaptive-logo-without-background.png',
    dir: 'ltr',
  }

  // @ts-ignore
  const notification = new Notification(title, options)
}

export const requestPermission = (trade: Trade) => {
  Notification.requestPermission(permission => {
    if (permission === 'granted') {
      sendNotification(trade)
    }
  })
}
