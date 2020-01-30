import { Platform } from '../../platform'
import { WindowConfig } from '../../types'
import { createTileMessage, FX_ENTITY_TYPE, SYMPHONY_APP_ID, SymphonyClient } from '../index'
import { waitForObject } from 'rt-util'
import DefaultRoute from '../../defaultRoute'
import Logo from '../../logo'
import { createDefaultPlatformWindow } from '../../defaultPlatformWindow'

export default class Symphony implements Platform {
  readonly name = 'browser'
  readonly type = 'browser'
  style = {
    height: '100%',
  }
  epics = []
  PlatformHeader = () => null
  PlatformFooter = () => null
  PlatformControls = () => null
  PlatformRoute = DefaultRoute
  Logo = Logo

  symphony?: SymphonyClient

  async init() {
    this.symphony = await waitForObject<SymphonyClient>('SYMPHONY')

    try {
      await this.symphony.remote.hello()
      await this.symphony.application.connect(SYMPHONY_APP_ID, ['modules', 'share'])
      console.info('Adaptive Symphony Initialised')
    } catch (e) {
      console.error('Adaptive Symphony Failed' + e)
    }
  }

  constructor() {
    this.init()
  }

  readonly allowTearOff = false

  window = {
    ...createDefaultPlatformWindow(window),
    open: (config: WindowConfig, onClose?: () => void) => {
      return Promise.resolve(undefined)
    },
  }

  fdc3 = {
    broadcast: () => {},
  }

  notification = {
    notify: (message: object) => {},
  }

  share = (ccyPair: string) => {
    if (!this.symphony) {
      console.error('SymphonyClient has not been initialized yet')
      return
    }
    const shareService = this.symphony.services.subscribe('share')
    shareService.share(FX_ENTITY_TYPE, {
      plaintext: `Latest prices for $${ccyPair}`,
      presentationML: createTileMessage(process.env.REACT_APP_BROKER_HOST || '', ccyPair),
      entityJSON: {
        type: FX_ENTITY_TYPE,
        version: 0.2,
        symbol: ccyPair,
      },
      entity: {},
      format: 'com.symphony.messageml.v2',
      inputAutofill: `Here are our latest prices for $${ccyPair}`,
    })
  }
}
