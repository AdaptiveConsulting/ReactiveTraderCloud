/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { OpenFinApplicationConfiguration } from '../types'

/* eslint-disable @typescript-eslint/camelcase */
export default (env: string): OpenFinApplicationConfiguration => ({
  startup_app: {
    name: 'Reactive Ecosystem Launcher',
    url: `https://web-${env}.adaptivecluster.com/launcher`,
    uuid: `reactive-launcher-${env}`,
    defaultWidth: 650,
    defaultHeight: 52,
    defaultTop: 160,
    defaultLeft: 30,
    autoShow: true,
    permissions: {
      System: {
        launchExternalProcess: true,
      },
    },
    saveWindowState: false,
    resizable: false,
    shadow: true,
    frame: false,
    backgroundColor: '#444C5F',
    alwaysOnTop: true,
    icon: `https://web-${env}.adaptivecluster.com/static/media/icon.ico`,
    applicationIcon: `https://web-${env}.adaptivecluster.com/static/media/adaptive-mark-large.png`,
    contextMenu: true,
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
    accelerator: {
      devtools: true,
      reload: true,
      reloadIgnoreCache: true,
      zoom: true,
    },
  },
  runtime: {
    arguments: '--remote-debugging-port=9222',
    version: '13.76.44.21',
  },
  shortcut: {
    company: 'Adaptive Consulting',
    icon: `https://web-${env}.adaptivecluster.com/static/media/icon.ico`,
    name: 'Reactive Ecosystem Launcher',
  },
  appAssets: [
    {
      src: `https://web-${env}.adaptivecluster.com/plugin/add-in.zip`,
      alias: 'excel-api-addin',
      version: '2.0.0',
    },
    {
      src: `https://web-${env}.adaptivecluster.com/plugin/LimitChecker.zip`,
      alias: 'LimitChecker',
      version: '1.6.0',
      target: 'LimitChecker.application',
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
})
