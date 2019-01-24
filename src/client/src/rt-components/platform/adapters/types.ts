export interface WindowConfig {
  name: string
  url: string
  width: number
  height: number
  center?: 'parent' | 'screen'
}

export interface AppConfig {
  url?: string
  icon?: string
  uuid?: string
  payload?: string | object
  topic?: string
}

export interface InteropServices {
  excel: boolean
  chartIQ: boolean
  notificationHighlight: boolean
}
