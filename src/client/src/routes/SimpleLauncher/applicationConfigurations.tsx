import React from 'react'

import { faChartArea, faExchangeAlt, faMicrophone, faPalette, faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const options = {
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
}
export type ApplicationType = 'window' | 'download' | 'application'

interface Provider {
  as: ApplicationType
  options: fin.WindowOptions
  cornerRounding?: {
    height: number
    width: number
  }
}

export interface ApplicationConfig {
  name: string
  url: string
  icon: JSX.Element
  provider: Provider
}

export const appConfigs: ApplicationConfig[] = [
  {
    name: 'Reactive Trader',
    url: `http://${location.host}`,
    icon: <FontAwesomeIcon icon={faExchangeAlt} />,
    provider: {
      as: 'application',
      options,
    },
  },
  {
    name: 'Reactive Analytics',
    url: 'http://demo-reactive-analytics.adaptivecluster.com/',
    icon: <FontAwesomeIcon icon={faChartArea} />,
    provider: {
      as: 'application',
      options: {
        ...options,
        frame: true,
      },
    },
  },
  {
    name: 'Adaptive Style Guide',
    url: `http://${location.host}/styleguide`,
    icon: <FontAwesomeIcon icon={faPalette} />,
    provider: {
      as: 'application',
      options: {
        ...options,
        frame: true,
      },
    },
  },
  {
    name: 'Bond Order Ticket',
    url: `http://${location.host}/order-ticket`,
    icon: <FontAwesomeIcon icon={faMicrophone} />,
    provider: {
      as: 'application',
      options: {
        ...options,
        defaultWidth: 672,
        defaultHeight: 384,
        minWidth: 672,
        minHeight: 384,
        resizable: false,
        maximizable: false,
        contextMenu: true,
        alwaysOnTop: false,
      },
      cornerRounding: {
        height: 10,
        width: 8,
      },
    },
  },
  {
    name: 'OpenFin Limit Checker',
    url: 'http://adaptiveconsulting.github.io/ReactiveTraderCloud/install/LimitChecker/LimitChecker.application',
    icon: <FontAwesomeIcon icon={faDownload} />,
    provider: {
      as: 'download',
      options,
    },
  },
]
