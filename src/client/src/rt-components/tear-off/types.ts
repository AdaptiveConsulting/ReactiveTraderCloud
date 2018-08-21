export interface WindowConfig {
  name: string
  url: string
  width: number
  height: number
}

export interface DesktopWindowConfig {
  createWindow: (window: Window) => void
  closeWindow: () => void
}

export interface BrowserWindowConfig {
  createWindow: (window: Window) => void
  center: 'parent' | 'screen'
}
