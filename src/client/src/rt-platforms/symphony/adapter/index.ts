import { BasePlatformAdapter } from '../../platformAdapter'
import { WindowConfig } from '../../types'
import { SymphonyClient, SYMPHONY_APP_ID, FX_ENTITY_TYPE, createTileMessage } from '../index'
import { waitForObject } from 'rt-util'

export default class Symphony extends BasePlatformAdapter {
  readonly name = 'browser'
  readonly type = 'browser'
  symphony: SymphonyClient;

  async init() {
    this.symphony = await waitForObject('SYMPHONY');

    try {
      await this.symphony.remote.hello()
      await this.symphony.application.connect(SYMPHONY_APP_ID, ['modules', 'share'])
      console.info('Adaptive Symphony Initialised')
    } catch (e) {
      console.error('Adaptive Symphony Failed' + e)
    }
  }

  constructor() {
    super()
    this.init()
  }
  readonly allowTearOff = false
  window = {
    close: () => window.close(),

    open: (config: WindowConfig, onClose?: () => void) => {
      return Promise.resolve(null)
    },
  }

  fdc3 = {
    broadcast: () => {},
  }

  notification = {
    notify: (message: object) => {},
  }

  share = (obj: any) => {
    const shareService = this.symphony.services.subscribe('share')
    const ccyPair = 'GBPUSD'
    shareService.share(FX_ENTITY_TYPE, {
      plaintext: `Latest Price for $${ccyPair}`,
      presentationML: createTileMessage(process.env.REACT_APP_BROKER_HOST, ccyPair),
      entityJSON: {
        type: FX_ENTITY_TYPE,
        version: 0.2,
        symbol: ccyPair,
      },
      entity: {},
      format: 'com.symphony.messageml.v2',
      inputAutofill: `Here is our Latest Prices for $${ccyPair}`,
    })
  }
}
