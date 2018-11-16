import React from 'react'

import { faChartArea, faExchangeAlt, faWindowRestore, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export type ConfigType = Partial<typeof config[0]>

export const config = [
  {
    name: 'Bond Order Ticket',
    url: 'http://localhost:3000/order-ticket',
    icon: <FontAwesomeIcon icon={faMicrophone} />,
    provider: {
      platform: 'openfin',
      as: 'application',
      options: {
        autoShow: true,
        defaultWidth: 672,
        defaultHeight: 384,
        minWidth: 672,
        minHeight: 384,
        resizable: false,
        maximizable: false,
        frame: false,
        nonPersistent: true,
        contextMenu: true,
        alwaysOnTop: false,
        accelerator: {
          devtools: true,
          reload: true,
          reloadIgnoringCache: true,
          zoom: true,
        },
        cornerRounding: {
          height: 10,
          width: 8,
        },
      },
    },
  },

  {
    name: 'Reactive Trader',
    url: 'http://localhost:3000/',
    icon: <FontAwesomeIcon icon={faExchangeAlt} />,
    provider: {
      platform: 'openfin',
      as: 'application',
      options: {
        autoShow: true,
        defaultWidth: 1280,
        defaultHeight: 900,
        minWidth: 800,
        minHeight: 600,
        resizable: true,
        maximizable: true,
        frame: false,
        nonPersistent: true,
        accelerator: {
          devtools: true,
          reload: true,
          reloadIgnoringCache: true,
          zoom: true,
        },
      },
    },
  },

  {
    name: 'Reactive Analytics',
    url: 'https://demo-reactive-analytics.adaptivecluster.com/',
    icon: <FontAwesomeIcon icon={faChartArea} />,
    provider: {
      platform: 'browser',
    },
  },
]

// Demo of opening as window instead of Application
//
// However, this does not work as the app can quit
// on behalf of the launcher
if (process.env.NODE_ENV === 'development') {
  config.push({
    name: 'Reactive Trader as Window',
    url: 'http://localhost:3000/',
    icon: <FontAwesomeIcon icon={faWindowRestore} />,
    provider: {
      platform: 'openfin',
      as: 'window',
      options: {
        autoShow: true,
        defaultWidth: 1280,
        defaultHeight: 900,
        minWidth: 800,
        minHeight: 600,
        resizable: true,
        maximizable: true,
        frame: false,
        nonPersistent: true,
        accelerator: {
          devtools: true,
          reload: true,
          reloadIgnoringCache: true,
          zoom: true,
        },
      },
    },
  })
}
