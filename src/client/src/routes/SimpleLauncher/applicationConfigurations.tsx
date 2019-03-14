import { reactiveAnalyticsIcon, reactiveTraderIcon, limitCheckerIcon, greenKeyIcon, excelIcon } from './icons/index'
import { PlatformName } from 'rt-components';

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
  icon: 'http://localhost:3000/static/media/icon.ico',
  accelerator:
    process.env.NODE_ENV !== 'development'
      ? {}
      : {
          devtools: true,
          reload: true,
          reloadIgnoringCache: true,
          zoom: true,
        },
}

const excelPreloadScripts: fin.DownloadPreloadOption[] = [
  // OpenFin Excel API not included here (not included in standard package)
  {
    url: `http://${location.host}/plugin/service-loader.js`,
  },
  {
    url: `http://${location.host}/plugin/fin.desktop.Excel.js`,
  },
]

type ApplicationType = 'window' | 'download' | 'application' | 'excel'
interface Provider {
  platformName: PlatformName
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
      platformName: 'openfin',
      applicationType: 'application',
      windowOptions: {
        ...defaultWindowOptions,
        preloadScripts: excelPreloadScripts,
        icon: `http://${location.host}/static/media/rt-icon.ico`,
      },
    },
  },
  {
    name: 'Reactive Analytics',
    url: 'http://demo-reactive-analytics.adaptivecluster.com/',
    icon: reactiveAnalyticsIcon,
    provider: {
      platformName: 'openfin',
      applicationType: 'application',
      windowOptions: {
        ...defaultWindowOptions,
        frame: true,
        icon: `http://${location.host}/static/media/ra-icon.ico`,
      },
    },
  },
  {
    name: 'Limit Checker',
    url: 'http://adaptiveconsulting.github.io/ReactiveTraderCloud/install/LimitChecker/LimitChecker.application',
    icon: limitCheckerIcon,
    provider: {
      platformName: 'openfin',
      applicationType: 'download',
      windowOptions: {
        ...defaultWindowOptions,
        icon: `http://${location.host}/static/media/limit-checker-icon.ico`,
      },
    },
  },
  {
    name: 'GreenKey',
    url: `http://${location.host}/order-ticket`,
    icon: greenKeyIcon,
    provider: {
      platformName: 'openfin',
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
        icon: `http://${location.host}/static/media/ic-mic_1.ico`,
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
      platformName: 'openfin',
      applicationType: 'excel',
      windowOptions: {
        preloadScripts: excelPreloadScripts,
        icon: `http://${location.host}/static/media/excel-icon.ico`,
      },
    },
  },
]
