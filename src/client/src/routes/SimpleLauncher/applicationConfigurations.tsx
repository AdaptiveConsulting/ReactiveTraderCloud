import icons from './Icons'

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
}
export type ApplicationType = 'window' | 'download' | 'application'
type Platform = 'browser' | 'openfin'
interface Provider {
  platform: Platform
  as: ApplicationType
  options: fin.WindowOptions
  cornerRounding?: {
    height: number
    width: number
  }
}

export interface ApplicationConfig {
  name: string
  url: string
  icon: any
  provider: Provider
}

export const appConfigs: ApplicationConfig[] = [
  {
    name: 'Reactive Trader',
    url: `http://${location.host}`,
    icon: icons.rt,
    provider: {
      platform: 'openfin',
      as: 'application',
      options,
    },
  },
  {
    name: 'Reactive Analytics',
    url: 'http://demo-reactive-analytics.adaptivecluster.com/',
    icon: icons.ra,
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
    icon: icons.limitChecker,
    provider: {
      platform: 'openfin',
      as: 'download',
      options,
    },
  },
  {
    name: 'GreenKey',
    url: `http://${location.host}/blotter`,
    icon: icons.greenkey,
    provider: {
      platform: 'openfin',
      as: 'application',
      options: {
        ...options,
      },
    },
  },
]
