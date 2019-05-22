import { WindowConfig } from './adapters'
interface ExternalWindow {
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
    width: 372, // 332 content + 20 padding
    height: 800,
    url: '/analytics',
  },
}

export const externalWindowDefault = {
  blotterRegion,
  analyticsRegion,
}
