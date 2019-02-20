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
  /* Excel interop data feeds */
  Analytics = 'position-update',
  Blotter = 'blotter-data',

  /* onClick message bus for trade
  highlight on notification click  */
  HighlightBlotter = 'highlight-blotter',
}
