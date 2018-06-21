import { logger } from '../../system'

const log = logger.create('OpenfinPopoutService')

const POPOUT_CONTAINER_ID = 'popout-content-container'

export default class PopoutServiceBase {
  popoutContainerId: string = POPOUT_CONTAINER_ID

  constructor() {
    this.popoutContainerId = POPOUT_CONTAINER_ID
  }

  /**
   * Should be overwritten
   */
  openPopout(...args: any[]) {
    log.error('NotImplementedException')
  }

  /**
   * Should be overwritten
   */
  undockPopout(...args: any[]) {
    log.error('NotImplementedException')
  }
}
