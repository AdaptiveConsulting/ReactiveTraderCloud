import ReactGA from 'react-ga'
import { PlatformWindow } from './platformWindow'

export function createDefaultPlatformWindow(window: Window): PlatformWindow {
  return {
    close: () => {
      ReactGA.event({
        category: 'RT - Window',
        action: 'close',
        label: window.name,
      })
      return Promise.resolve(window.close())
    },
  }
}
