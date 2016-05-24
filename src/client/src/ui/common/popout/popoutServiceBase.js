import { logger } from '../../../system';
import './popoutRegion.scss';

let _log:logger.Logger = logger.create('PopoutServiceBase');

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
