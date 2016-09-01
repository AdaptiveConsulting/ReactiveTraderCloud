import { Router,  observeEvent } from 'esp-js';
import { logger } from '../../../system';
import { ModelBase } from '../../common';

var _log:logger.Logger = logger.create('HeaderModel');

export default class HeaderModel extends ModelBase {

  constructor(
    modelId:string,
    router:Router
  ) {
    super(modelId, router);
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Header model starting`);
  }

  @observeEvent('externalLinkClicked')
  _onExternalLinkClicked() {
    _log.info(`external link clicked`);
    // TODO , if in open fin deal with launching the link
  }

  @observeEvent('minimiseClicked')
  _onMinimiseClicked(e) {
    _log.info(`minimise clicked`);
    // TODO , if in open fin deal with launching the link
  }

  @observeEvent('maximiseClicked')
  _onMaximiseClicked() {
    _log.info(`maximise clicked`);
    // TODO , if in open fin deal with launching the link
  }

  @observeEvent('closeClicked')
  _onCloseClicked() {
    _log.info(`closed clicked`);
    // TODO , if in open fin deal with launching the link
  }
}
