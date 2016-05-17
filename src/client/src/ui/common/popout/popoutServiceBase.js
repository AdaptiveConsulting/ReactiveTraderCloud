import {logger} from '../../../system';

let _log:logger.Logger = logger.create('PopoutServiceBase');


export default class PopoutServiceBase {
  openPopout() {
    _log.error(new Error('NotImplementedException'));
  }
}
