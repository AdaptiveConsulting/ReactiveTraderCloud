import React from 'react'

import { faChartArea, faExchangeAlt, faMicrophone, faPalette, faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getEnvVars } from '../../config/config'

const endpointConfig = getEnvVars(process.env.REACT_APP_ENV!)

const accelerator = {
  devtools: true,
  reload: true,
  reloadIgnoringCache: true,
  zoom: true,
}

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
  accelerator,
}

const provider = {
  platform: 'openfin',
  as: 'application',
}

export type ConfigType = Partial<typeof config[0]>

export const config = [
  {
    name: 'Reactive Trader',
    url: `http://${endpointConfig.overwriteServerEndpoint ? endpointConfig.serverEndpointUrl : location.hostname}`,
    icon: <FontAwesomeIcon icon={faExchangeAlt} />,
    provider: {
      ...provider,
      options,
    },
  },
  {
    name: 'Reactive Analytics',
    url: 'http://demo-reactive-analytics.adaptivecluster.com/',
    icon: <FontAwesomeIcon icon={faChartArea} />,
    provider: {
      ...provider,
      options: {
        ...options,
        frame: true,
      },
    },
  },
  {
    name: 'Adaptive Style Guide',
    url: `http://${
      endpointConfig.overwriteServerEndpoint ? endpointConfig.serverEndpointUrl : location.hostname
    }/styleguide`,
    icon: <FontAwesomeIcon icon={faPalette} />,
    provider: {
      ...provider,
      options: {
        ...options,
        frame: true,
      },
    },
  },
  {
    name: 'Bond Order Ticket',
    url: `http://${
      endpointConfig.overwriteServerEndpoint ? endpointConfig.serverEndpointUrl : location.hostname
    }/order-ticket`,
    icon: <FontAwesomeIcon icon={faMicrophone} />,
    provider: {
      ...provider,
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
      platform: 'openfin',
      as: 'download',
      options,
    },
  },
]
