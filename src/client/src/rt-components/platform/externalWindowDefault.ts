import { WindowConfig } from './adapters'
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
    url: '/blotter',
  },
}

const analyticsRegion: ExternalWindow = {
  title: 'Analytics',
  config: {
    name: 'analytics',
    width: 352, // 332 content + 10 padding
    height: 800,
    url: '/analytics',
  },
}

export const externalWindowDefault = {
  blotterRegion,
  analyticsRegion,
}
