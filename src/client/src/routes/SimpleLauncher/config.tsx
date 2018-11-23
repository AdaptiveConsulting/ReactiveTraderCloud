import React from 'react'

import {
  faChartArea,
  faExchangeAlt,
  faWindowRestore,
  faMicrophone,
  faPalette,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getEnvVars } from '../../config/config'

const endpointConfig = getEnvVars(process.env.REACT_APP_ENV!)

export type ConfigType = Partial<typeof config[0]>

export const config = [
  {
    name: 'Reactive Trader',
    url: `http://${endpointConfig.overwriteServerEndpoint ? endpointConfig.serverEndpointUrl : location.hostname}`,
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
    url: 'http://demo-reactive-analytics.adaptivecluster.com/',
    icon: <FontAwesomeIcon icon={faChartArea} />,
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
        frame: true,
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
    name: 'Adaptive Style Guide',
    url: `http://${
      endpointConfig.overwriteServerEndpoint ? endpointConfig.serverEndpointUrl : location.hostname
    }/styleguide`,
    icon: <FontAwesomeIcon icon={faPalette} />,
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
        frame: true,
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
    name: 'Bond Order Ticket',
    url: `http://${
      endpointConfig.overwriteServerEndpoint ? endpointConfig.serverEndpointUrl : location.hostname
    }/order-ticket`,
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
    name: 'OpenFin Limit Checker',
    url: `http://${endpointConfig.overwriteServerEndpoint ? endpointConfig.serverEndpointUrl : location.hostname}`,
    icon: <FontAwesomeIcon icon={faTachometerAlt} />, // change this one as well
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
]

// Demo of opening as window instead of Application
//
// However, this does not work as the app can quit
// on behalf of the launcher
if (process.env.NODE_ENV === 'development') {
  config.push({
    name: 'Reactive Trader as Window',
    url: 'http://localhost:3000/', //TODO should get the local page rather than manually setting it up
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
