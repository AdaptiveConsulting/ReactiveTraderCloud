import { Router, observeEvent } from 'esp-js/src';
import { logger } from '../../../system';
import { Connection } from '../../../system/service';
import { ConnectionStatus } from '../../../system/service';
import { ModelBase } from '../../common';
import { WellKnownModelIds } from '../../../';

var _log:logger.Logger = logger.create('ShellModel');

export default class ShellModel extends ModelBase {
  _connection:Connection;
  sessionExpired:boolean;
  canExpandMainArea:boolean;
  wellKnownModelIds:WellKnownModelIds;

  constructor(modelId:string, router:Router, connection:Connection) {
    super(modelId, router);
    this._connection = connection;
    this.sessionExpired = false;
    this.wellKnownModelIds = WellKnownModelIds;
    this.appVersion = `v${__VERSION__}`;
  }

  @observeEvent('init')
  _onInit() {
    _log.info('Shell model starting');
    this._observeForSessionExpired();
    this._observeForBlotterTearOut();
  }

  @observeEvent('reconnectClicked')
  _onReconnect() {
    this._connection.connect();
  }

  /**
   * Observe blotter tear out events, so we can resize the workspace/analytics area
   * @private
   */
  _observeForBlotterTearOut() {
    let _this = this;
    this.addDisposable(
      this.router
        .getEventObservable(WellKnownModelIds.blotterModelId, 'tearOffBlotter')
        .observe(() => {
          _this.router.runAction(_this.modelId, () =>_this.canExpandMainArea = true);
        })
    );
    this.addDisposable(
      this.router
        .getEventObservable(WellKnownModelIds.popoutRegionModelId, 'removeFromRegion')
        .where(({model}) => model.modelId === WellKnownModelIds.blotterModelId)
        .observe(() => {
          _this.router.runAction(_this.modelId, () =>_this.canExpandMainArea = false);
        })
    );
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
