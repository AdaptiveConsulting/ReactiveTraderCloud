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

export enum InteropTopics {
  Analytics = 'position-update',
  Blotter = 'blotter-data',
}

export interface ExcelInterop {
  init: () => void
  open: () => void
  publish: (topic: string, message: string | object) => void
}
