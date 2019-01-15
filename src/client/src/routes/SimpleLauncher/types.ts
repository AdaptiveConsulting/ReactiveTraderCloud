import { Provider } from 'react-redux'

export interface Accelerator {
  devtools: boolean
  reload: boolean
  reloadIgnoringCache: boolean
  zoom: boolean
}

export interface Options {
  autoShow: boolean
  defaultWidth: number
  defaultHeight: number
  minWidth: number
  minHeight: number
  resizable: boolean
  maximizable: boolean
  contextMenu?: boolean
  alwaysOnTop?: boolean
  frame: boolean
  nonPersistent: boolean
  accelerator: Accelerator
}

export interface Provider {
  platform: string
  as: string
  options: Options
  cornerRounding?: {
    height: number
    width: number
  }
}
