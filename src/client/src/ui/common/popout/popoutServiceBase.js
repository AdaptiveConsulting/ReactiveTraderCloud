import {logger} from '../../../system';
import './popoutRegion.scss';

let _log:logger.Logger = logger.create('PopoutServiceBase');

let POPOUT_CONTAINER_ID = 'popout-content-container';

export default class PopoutServiceBase {
  constructor() {
    this._popoutContainerId = POPOUT_CONTAINER_ID;
  }
  
  openPopout() {
    _log.error(new Error('NotImplementedException'));
  }
}
