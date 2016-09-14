import { Router, observeEvent } from 'esp-js';
import { viewBinding } from 'esp-js-react';
import { logger } from '../../../system';
import { Connection } from '../../../system/service';
import { ConnectionStatus } from '../../../system/service';
import { ModelBase } from '../../common';
import { WellKnownModelIds } from '../../../';
import ShellView from '../views/shellView';

var _log:logger.Logger = logger.create('ShellModel');

@viewBinding(ShellView)
export default class ShellModel extends ModelBase {
  _connection:Connection;
  sessionExpired:boolean;
  blotterRegionHasContent:boolean;
  sidebarRegionHasContent:boolean;
  sidebarRegionIsCollapsed:boolean;
  wellKnownModelIds:WellKnownModelIds;

  _blotterRegionModel:SingleItemRegionModel;
  _sidebarRegionModel:SingleItemRegionModel;

  constructor(
    modelId:string,
    router:Router,
    connection:Connection,
    blotterRegionModel:SingleItemRegionModel,
    sidebarRegionModel:SingleItemRegionModel
  ) {
    super(modelId, router);
    this._connection = connection;
    this.sessionExpired = false;
    this.wellKnownModelIds = WellKnownModelIds;
    this.appVersion = `v${__VERSION__}`;
    this.blotterRegionHasContent = true;
    this.sidebarRegionHasContent = true;
    this.sidebarRegionIsCollapsed = false;

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
        (status:String) => {
          this.sessionExpired = status === ConnectionStatus.sessionExpired;
        },
        err => {
          _log.error('Error on connection status stream', err);
        })
    );
  }
}
