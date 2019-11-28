import { PlatformWindow } from './platformWindow'

export function createDefaultPlatformWindow(window: Window): PlatformWindow {
  return {
    close: () => Promise.resolve(window.close())
  }
}
