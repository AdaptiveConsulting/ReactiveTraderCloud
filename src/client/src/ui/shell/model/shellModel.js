import _ from 'lodash';
import { Router, observeEvent } from 'esp-js/src';
import { logger } from '../../../system';
import { Connection } from '../../../system/service';
import { ConnectionStatus } from '../../../system/service';
import { ModelBase } from '../../common';

var _log:logger.Logger = logger.create('ShellModel');

export default class ShellModel extends ModelBase {
  _connection:Connection;

  sessionExpired:boolean;

  constructor(router:Router, connection:Connection) {
    super('shellModelId', router);
    this._connection = connection;
    this.sessionExpired = false;
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Shell model starting`);
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
        (status:String) =>{
          this.sessionExpired = status === ConnectionStatus.sessionExpired;
        },
        err =>{
          _log.error('Error on connection status stream', err);
        })
    );
  }
}
