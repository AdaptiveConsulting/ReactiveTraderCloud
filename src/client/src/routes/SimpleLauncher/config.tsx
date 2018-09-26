import { faChartArea, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const config = [
  {
    name: 'Reactive Trader',
    url: 'http://localhost:3000/',
    icon: <FontAwesomeIcon icon={faExchangeAlt} />,
    provider: {
      platform: 'openfin',
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
  // {
  //   name: 'Reactive Analytics 2',
  //   url: 'https://demo-reactive-analytics.adaptivecluster.com/',
  //   icon: <FontAwesomeIcon icon={faChartPie} />,
  //   provider: {
  //     platform: 'openfin',
  //     options: {
  //       autoShow: true,
  //       defaultWidth: 1280,
  //       defaultHeight: 900,
  //       minWidth: 800,
  //       minHeight: 600,
  //       resizable: true,
  //       maximizable: true,
  //       frame: false,
  //       nonPersistent: true,
  //       accelerator: {
  //         devtools: true,
  //         reload: true,
  //         reloadIgnoringCache: true,
  //         zoom: true,
  //       },
  //     },
  //   },
  // },
]
