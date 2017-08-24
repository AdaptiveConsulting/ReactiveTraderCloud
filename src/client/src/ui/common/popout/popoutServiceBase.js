import './popoutRegion.scss';

import logger from '../../../system/logger';

var _log = logger.create('OpenfinPopoutService');

const POPOUT_CONTAINER_ID = 'popout-content-container';

export default class PopoutServiceBase {
  constructor() {
    this._popoutContainerId = POPOUT_CONTAINER_ID;
  }

  /**
   * Should be overwritten
   */
  openPopout() {
    _log.error(new Error('NotImplementedException'));
  }

  /**
   * Should be overwritten
   */
  undockPopout() {
    _log.error(new Error('NotImplementedException'));
  }
}
