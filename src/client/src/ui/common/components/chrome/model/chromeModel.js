import { Router, observeEvent } from 'esp-js';
import { logger } from '../../../../../system/';
import { OpenFin } from '../../../../../system/openFin/';
import { ModelBase } from '../../../';

var _log = logger.create('ChromeModel');

export default class ChromeModel extends ModelBase {
  _openFin;
  isRunningInOpenFin;

  constructor(modelId, router, openFin) {
    super(modelId, router);
    this._openFin = openFin;
  }

  @observeEvent('init')
  _onInit() {
    _log.info('Chrome model starting');
    this.isRunningInOpenFin = this._openFin.isRunningInOpenFin;
  }

  @observeEvent('minimizeClicked')
  _onMinimizeClicked() {
    this._openFin.minimize();
  }

  @observeEvent('maximizeClicked')
  _onMaximizeClicked() {
    this._openFin.maximize();
  }

  @observeEvent('closeClicked')
  _onCloseClicked() {
    this._openFin.close();
  }

}
