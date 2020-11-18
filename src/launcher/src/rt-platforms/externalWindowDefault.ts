import { WindowConfig } from './'

export interface ExternalWindow {
  title: string
  config: WindowConfig
}

const blotterRegion: ExternalWindow = {
  title: 'Blotter',
  config: {
    name: 'blotter',
    width: 850,
    height: 450,
    minWidth: 300,
    minHeight: 200,
    url: '/blotter',
  },
}

const analyticsRegion: ExternalWindow = {
  title: 'Analytics',
  config: {
    name: 'analytics',
    width: 352, // 332 content + 10 padding
    height: 800,
    minWidth: 360,
    minHeight: 200,
    url: '/analytics',
  },
}

const liveRatesRegion: ExternalWindow = {
  title: 'LiveRates',
  config: {
    name: 'LiveRates',
    width: 664,
    height: 617,
    minWidth: 664,
    minHeight: 617,
    url: '/tiles',
  },
}

export const externalWindowDefault = {
  blotterRegion,
  analyticsRegion,
  liveRatesRegion,
}
