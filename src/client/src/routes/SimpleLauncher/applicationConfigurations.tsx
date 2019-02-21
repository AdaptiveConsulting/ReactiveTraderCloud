import { reactiveAnalyticsIcon, reactiveTraderIcon, limitCheckerIcon, greenKeyIcon, excelIcon } from './icons'

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
  preload: [
    // OpenFin Excel API not included here (not included in standard package)
    {
      url: `http://${location.host}/plugin/service-loader.js`,
    },
    {
      url: `http://${location.host}/plugin/fin.desktop.Excel.js`,
    },
  ],
  appAssets: [
    {
      src: `http://${location.host}/plugin/add-in.zip`,
      alias: 'excel-api-addin',
      version: '2.0.0',
      forceDownload: true,
    },
  ],
}

export type ApplicationType = 'window' | 'download' | 'application'
type Platform = 'browser' | 'openfin' | 'excel'
interface Provider {
  platform: Platform
  as: ApplicationType
  options?: fin.WindowOptions
  cornerRounding?: {
    height: number
    width: number
  }
}

export interface ApplicationConfig {
  name: string
  url?: string
  icon: JSX.Element
  provider?: Provider
}

export const appConfigs: ApplicationConfig[] = [
  {
    name: 'Reactive Trader',
    url: `http://${location.host}`,
    icon: reactiveTraderIcon,
    provider: {
      platform: 'openfin',
      as: 'application',
      options,
    },
  },
  {
    name: 'Reactive Analytics',
    url: 'http://demo-reactive-analytics.adaptivecluster.com/',
    icon: reactiveAnalyticsIcon,
    provider: {
      platform: 'openfin',
      as: 'application',
      options: {
        ...options,
        frame: true,
      },
    },
  },
  {
    name: 'Limit Checker',
    url: 'http://adaptiveconsulting.github.io/ReactiveTraderCloud/install/LimitChecker/LimitChecker.application',
    icon: limitCheckerIcon,
    provider: {
      platform: 'openfin',
      as: 'download',
      options,
    },
  },
  {
    name: 'GreenKey',
    url: `http://${location.host}/order-ticket`,
    icon: greenKeyIcon,
    provider: {
      platform: 'openfin',
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
    name: 'Excel',
    icon: excelIcon,
    provider: {
      platform: 'excel',
      as: 'application',
    },
  },
]
