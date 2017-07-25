import { observeEvent } from 'esp-js';
import { viewBinding } from 'esp-js-react';
import { logger } from '../../../system';
import { ConnectionStatus } from '../../../system/service';
import { ModelBase } from '../../common';
import { WellKnownModelIds } from '../../../';
import ShellView from '../views/shellView';

var _log = logger.create('ShellModel');

@viewBinding(ShellView)
export default class ShellModel extends ModelBase {
  _connection;
  sessionExpired;
  wellKnownModelIds;

  _blotterRegionModel;
  _sidebarRegionModel;

  constructor(
    modelId,
    router,
    connection,
    blotterRegionModel,
    sidebarRegionModel
  ) {
    super(modelId, router);
    this._connection = connection;
    this.sessionExpired = false;
    this.wellKnownModelIds = WellKnownModelIds;
    this.appVersion = `v${__VERSION__}`;

    this._blotterRegionModel = blotterRegionModel;
    this._sidebarRegionModel = sidebarRegionModel;
  }

  @observeEvent('init')
  _onInit() {
    _log.info('Shell model starting');
    this._observeForSessionExpired();
  }

  @observeEvent('reconnectClicked')
  _onReconnect() {
    this._connection.connect();
  }

  _observeForSessionExpired() {
    this.addDisposable(
      this._connection.connectionStatusStream.subscribeWithRouter(
        this.router,
        this.modelId,
        (status) => {
          this.sessionExpired = status === ConnectionStatus.sessionExpired;
        },
        err => {
          _log.error('Error on connection status stream', err);
        })
    );
  }
}
