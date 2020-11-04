import ReactGA from 'react-ga'
import GlueWeb from '@glue42/web'
import { WindowConfig } from '../types'
import { Platform } from '../platform'
import { registerWindowMethods } from './window'
import { ApplicationEpic } from 'StoreTypes'
import { GlueHeader } from './'
import DefaultRoute from 'rt-platforms/defaultRoute'
import Logo from '../logo'

export class Glue42Core implements Platform {
  allowTearOff = true
  allowPopIn = true
  readonly name = 'glue-core'
  readonly type = 'browser'
  style = {
    height: '100%',
  }

  constructor() {
    GlueWeb()
      .then(glue => {
        window.glue = glue
        registerWindowMethods()
      })
      .catch(e => {
        console.log(e)
        throw new Error('Failed to init Glue42Web')
      })
  }

  window = {
    close: () => {
      ReactGA.event({
        category: 'RT - Window',
        action: 'close',
        label: window.name,
      })
      return Promise.resolve(window.close())
    },

    open: (config: WindowConfig, onClose?: () => void) => {
      ReactGA.event({
        category: 'RT - Window',
        action: 'open',
        label: config.name,
      })
      window.glue.windows.onWindowRemoved((windowRemoved: any) => {
        onClose && onClose()
      })

      const paramType = config.url.includes('?') ? '&' : '?'
      const url = `${config.url}${paramType}glue=CORE`

      return window.glue.windows
        .open(config.name, url, config)
        .then((createdWindow: any) => createdWindow)
    },
    show: () => {},
  }

  notification = {
    notify: () => null,
  }

  epics: Array<ApplicationEpic> = []

  PlatformHeader: React.FC<any> = () => null

  PlatformFooter: React.FC<any> = () => null

  PlatformControls: React.FC<any> = GlueHeader

  PlatformRoute: React.FC = DefaultRoute

  Logo = Logo
}
