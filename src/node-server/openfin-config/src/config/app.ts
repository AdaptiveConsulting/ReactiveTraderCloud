/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { OpenFinApplicationConfiguration } from '../types'

/* eslint-disable @typescript-eslint/camelcase */
export default (env: string): OpenFinApplicationConfiguration => {
  const name = `Reactive Trader Cloud${env !== 'demo' ? ` (${env.toUpperCase()})` : ''}`

  return {
    devtools_port: 9090,
    splashScreenImage: `https://web-${env}.adaptivecluster.com/static/media/splash-screen.jpg`,
    startup_app: {
      name,
      url: `https://web-${env}.adaptivecluster.com/`,
      uuid: `reactive-trader-cloud-web-${env}`,
      applicationIcon: `https://web-${env}.adaptivecluster.com/static/media/adaptive-mark-large.png`,
      autoShow: true,
      defaultWidth: 1280,
      defaultHeight: 900,
      minWidth: 800,
      minHeight: 600,
      resizable: true,
      maximizable: true,
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
    shortcut: {
      company: 'Adaptive Consulting',
      icon: `https://web-${env}.adaptivecluster.com/static/media/icon.ico`,
      name,
    },
    appAssets: [
      {
        src: `https://web-${env}.adaptivecluster.com/plugin/add-in.zip`,
        alias: 'excel-api-addin',
        version: '2.0.0',
      },
    ],
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
  }
}
