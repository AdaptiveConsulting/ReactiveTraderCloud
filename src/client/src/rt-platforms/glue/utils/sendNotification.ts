import { Trade } from 'rt-types'
import { onGlueLoaded } from '../glue'

export enum NotifyPermission {
  granted = 'granted',
}

export interface NotificationMessage {
  tradeNotification?: Trade
}

export const sendNotification = ({ tradeNotification }: NotificationMessage) => {
  onGlueLoaded(() => {
    const status = tradeNotification.status === 'done' ? 'Accepted' : 'Rejected'
    const title = `Trade ${status}: ${tradeNotification.direction} ${tradeNotification.dealtCurrency} ${tradeNotification.notional}`
    const body = `vs. ${tradeNotification.termsCurrency} \nRate ${tradeNotification.spotRate}    Trade ID ${tradeNotification.tradeId}`

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
    }

    window.glue.agm
      .invoke('T42.GNS.Publish.RaiseNotification', invokeConfig)
      .then(console.info)
      .catch(console.error)
  })
}
