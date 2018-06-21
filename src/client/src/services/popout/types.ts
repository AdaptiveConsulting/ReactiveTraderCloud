import { Provider, ProviderProps } from 'react-redux'
import { default as BrowserPopoutService } from './browserPopoutService'
import { default as OpenfinPopoutService } from './openfinPopoutService'

export type PopoutService = BrowserPopoutService | OpenfinPopoutService

export interface PopoutWindowOptions {
  minWidth: number
  scrollable: boolean
  title?: string
  width: number
  height: number
  minHeight?: number
  dockable: boolean
  resizable: boolean
}

export interface PopoutOptions {
  id: string
  url: string
  title: string
  onClosing: () => any
  windowOptions: PopoutWindowOptions
}

export type PopoutView = React.ComponentElement<
  Readonly<{
    children?: React.ReactNode
  }> &
    Readonly<ProviderProps>,
  Provider
>
