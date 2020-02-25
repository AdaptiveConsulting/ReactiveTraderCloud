/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { OpenFinApplicationConfiguration } from '../types'

/* eslint-disable @typescript-eslint/camelcase */
export default (env: string): OpenFinApplicationConfiguration => ({
  startup_app: {
    autoShow: true,
    frame: false,
    // @ts-ignore
    _comment:
      'Openfin Excel API preloaded below + added in appAssets (not included in standard OpenFin package)',
    preload: [
      {
        url: `https://web-${env}.adaptivecluster.com/plugin/service-loader.js`,
      },
      {
        url: `https://web-${env}.adaptivecluster.com/plugin/fin.desktop.Excel.js`,
      },
    ],
  },
  runtime: {
    version: '13.76.44.21',
  },
  services: [
    {
      name: 'layouts',
      config: {
        features: {
          snap: true,
          dock: true,
          tab: false,
        },
      },
      manifestUrl: 'https://cdn.openfin.co/services/openfin/layouts/1.1.0/app.json',
    },
    {
      name: 'fdc3',
      manifestUrl: 'https://cdn.openfin.co/services/openfin/fdc3/0.2.0/app.json',
    },
    {
      name: 'notifications',
      manifestUrl: 'https://cdn.openfin.co/services/openfin/notifications/0.11.1/app.json',
    },
  ],
})
