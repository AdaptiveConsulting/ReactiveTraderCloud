export interface WindowConfig {
  name: string
  url: string
  width: number
  height: number
}

//export interface DesktopWindowConfig {}

export interface BrowserWindowConfig {
  center: 'parent' | 'screen'
}
