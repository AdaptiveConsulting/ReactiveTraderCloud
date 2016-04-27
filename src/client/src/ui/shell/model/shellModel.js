import { Router, observeEvent } from 'esp-js/src';
import { logger } from '../../../system';
import { Connection } from '../../../system/service';
import { ConnectionStatus } from '../../../system/service';
import { OpenFin } from '../../../system/openFin';
import { ModelBase } from '../../common';
import { WellKnownModelIds } from '../../../';

var _log:logger.Logger = logger.create('ShellModel');

export default class ShellModel extends ModelBase {
  _connection:Connection;
  _openFin:OpenFin;
  sessionExpired:boolean;
  wellKnownModelIds:WellKnownModelIds;
  isRunningInOpenFin:boolean;

  constructor(modelId:string, router:Router, connection:Connection, openFin) {
    super(modelId, router);
    this._connection = connection;
    this._openFin = openFin;
    this.sessionExpired = false;
    this.wellKnownModelIds = WellKnownModelIds;
    this.useContainerChrome = false;
    this.appVersion = `v${__VERSION__}`;
  }

  @observeEvent('init')
  _onInit() {
    _log.info('Shell model starting');
    this._observeForSessionExpired();
    this.isRunningInOpenFin = this._openFin.isRunningInOpenFin;
  }

  @observeEvent('reconnectClicked')
  _onReconnect() {
    this._connection.connect();
  }

  @observeEvent('minimizeClicked')
  _onMinimizeClicked() {
    this._openFin.minimise();
  }

  @observeEvent('maximizeClicked')
  _onMaximizeClicked() {
    this._openFin.maximise();
  }

  @observeEvent('closeClicked')
  _onCloseClicked() {
    this._openFin.close();
  }

  _observeForSessionExpired() {
    this.addDisposable(
      this._connection.connectionStatusStream.subscribeWithRouter(
        this.router,
        this.modelId,
        (status:String) => {
          this.sessionExpired = status === ConnectionStatus.sessionExpired;
        },
        err =>{
          _log.error('Error on connection status stream', err);
        })
    );
  }
}
