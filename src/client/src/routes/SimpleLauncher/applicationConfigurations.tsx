import { reactiveAnalyticsIcon, reactiveTraderIcon, limitCheckerIcon, greenKeyIcon, excelIcon } from './icons/index'

const defaultWindowOptions: OpenFinWindowOptions = {
  autoShow: true,
  defaultWidth: 1280,
  defaultHeight: 900,
  minWidth: 800,
  minHeight: 600,
  resizable: true,
  maximizable: true,
  defaultCentered: true,
  frame: false,
  shadow: true,
  accelerator: process.env.NODE_ENV !== 'development' ? {} : {
    devtools: true,
    reload: true,
    reloadIgnoringCache: true,
    zoom: true,
  }
}

export type ApplicationType = 'window' | 'download' | 'application'
type PlatformType = 'browser' | 'openfin' | 'excel'
interface Provider {
  platformType: PlatformType
  applicationType: ApplicationType
  windowOptions?: OpenFinWindowOptions
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
      platformType: 'openfin',
      applicationType: 'application',
      windowOptions: defaultWindowOptions,
    },
  },
  {
    name: 'Reactive Analytics',
    url: 'http://demo-reactive-analytics.adaptivecluster.com/',
    icon: reactiveAnalyticsIcon,
    provider: {
      platformType: 'openfin',
      applicationType: 'application',
      windowOptions: {
        ...defaultWindowOptions,
        frame: true,
      },
    },
  },
  {
    name: 'Limit Checker',
    url: 'http://adaptiveconsulting.github.io/ReactiveTraderCloud/install/LimitChecker/LimitChecker.application',
    icon: limitCheckerIcon,
    provider: {
      platformType: 'openfin',
      applicationType: 'download',
      windowOptions: defaultWindowOptions,
    },
  },
  {
    name: 'GreenKey',
    url: `http://${location.host}/order-ticket`,
    icon: greenKeyIcon,
    provider: {
      platformType: 'openfin',
      applicationType: 'application',
      windowOptions: {
        ...defaultWindowOptions,
        defaultWidth: 672,
        defaultHeight: 384,
        minWidth: 672,
        minHeight: 384,
        resizable: false,
        maximizable: false,
        contextMenu: true,
        alwaysOnTop: false,
        cornerRounding: {
          height: 10,
          width: 8,
        },
      },
    },
  },
  {
    name: 'Excel',
    icon: excelIcon,
    provider: {
      platformType: 'excel',
      applicationType: 'application',
      windowOptions: {
        preloadScripts: [
          // OpenFin Excel API not included here (not included in standard package)
          {
            url: `http://${location.host}/plugin/service-loader.js`,
          },
          {
            url: `http://${location.host}/plugin/fin.desktop.Excel.js`,
          },
        ],
      },
    },
  },
]
