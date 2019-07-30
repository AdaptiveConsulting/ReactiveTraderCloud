import { Trade } from 'rt-types'

export enum NotifyPermission {
  granted = 'granted',
}

export interface NotificationMessage {
  tradeNotification?: Trade
}

/**
 * Send notification to the Glue Notification Server
 * @param {Trade} tradeNotification
 */
export const sendNotification = ({ tradeNotification }: NotificationMessage) => {
  if (!(window as any).glue) {
    return
  }

  const status = tradeNotification.status === 'done' ? 'Accepted' : 'Rejected'
  const title = `Trade ${status}: ${tradeNotification.direction} ${
    tradeNotification.dealtCurrency
  } ${tradeNotification.notional}`
  const body = `vs. ${tradeNotification.termsCurrency} \nRate ${
    tradeNotification.spotRate
  }    Trade ID ${tradeNotification.tradeId}`

  const options = {
    body,
    icon: './static/media/adaptive-logo-without-background.png',
    dir: 'ltr',
  }

  const invokeConfig = {
    notification: {
      source: '',
      title,
      severity: 'Low',
      description: options.body,
      glueRoutingDetailMethodName: 'noop',
      actions: [
        {
          name: 'openWorkspace',
          displayName: 'Open Workspace',
          parameters: [
            {
              name: 'symbol',
              value: {
                stringValue: tradeNotification.symbol,
              },
            },
          ],
        },
      ],
    },
  };

  (window as any).glue.agm
    .invoke('T42.GNS.Publish.RaiseNotification', invokeConfig)
    .then(console.info)
    .catch(console.error)

  // @ts-ignore
  // const notification = new Notification(title, options)
}
