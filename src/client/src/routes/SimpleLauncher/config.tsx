import React from 'react'

import { faChartArea, faExchangeAlt, faMicrophone, faPalette, faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getEnvVars } from '../../config/config'

const endpointConfig = getEnvVars(process.env.REACT_APP_ENV!)

interface Accelerator {
  devtools: boolean
  reload: boolean
  reloadIgnoringCache: boolean
  zoom: boolean
}
const accelerator: Accelerator = {
  devtools: true,
  reload: true,
  reloadIgnoringCache: true,
  zoom: true,
}

interface Options {
  autoShow: boolean
  defaultWidth: number
  defaultHeight: number
  minWidth: number
  minHeight: number
  resizable: boolean
  maximizable: boolean
  contextMenu?: boolean
  alwaysOnTop?: boolean
  frame: boolean
  nonPersistent: boolean
  accelerator: Accelerator
}

const options: Options = {
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

interface Provider {
  platform: string
  as: string
  options: Options
  cornerRounding?: {
    height: number
    width: number
  }
}
const provider = {
  platform: 'openfin',
  as: 'application',
} as Provider

export type ConfigType = Partial<typeof config[0]>
interface Config {
  name: string
  url: string
  icon: JSX.Element
  provider: Provider
}

export const config: Config[] = [
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
