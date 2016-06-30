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
  isBlotterOut:boolean;
  isAnalyticsOut:boolean;
  isSidebarOut:boolean;
  wellKnownModelIds:WellKnownModelIds;
  showSideBar:boolean;

  constructor(modelId:string, router:Router, connection:Connection) {
    super(modelId, router);
    this._connection = connection;
    this.sessionExpired = false;
    this.showSideBar = true;
    this.wellKnownModelIds = WellKnownModelIds;
    this.appVersion = `v${__VERSION__}`;
  }

  @observeEvent('init')
  _onInit() {
    _log.info('Shell model starting');
    this._observeForSessionExpired();
    this._observeForBlotterTearOut();
    this._observeForAnalyticsTearOut();
    this._observeSidebarEvents();
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
        .observe(() => _this.router.runAction(_this.modelId, () => _this.isBlotterOut = true))
    );
    this.addDisposable(
      this.router
        .getEventObservable(WellKnownModelIds.popoutRegionModelId, 'removeFromRegion')
        .where(({model}) => model.modelId === WellKnownModelIds.blotterModelId)
        .observe(() => _this.router.runAction(_this.modelId, () => _this.isBlotterOut = false))
    );
  }

  /**
   * Observe blotter tear out events, so we can resize the workspace/analytics area
   * @private
   */
  _observeForAnalyticsTearOut() {
    let _this = this;
    this.addDisposable(
      this.router
        .getEventObservable(WellKnownModelIds.analyticsModelId, 'popOutAnalytics')
        .observe(() => _this.router.runAction(_this.modelId, () => _this.isAnalyticsOut = _this.isSidebarOut = true))
    );
    this.addDisposable(
      this.router
        .getEventObservable(WellKnownModelIds.popoutRegionModelId, 'removeFromRegion')
        .where(({model}) => model.modelId === WellKnownModelIds.analyticsModelId)
        .observe(() => _this.router.runAction(_this.modelId, () => _this.isAnalyticsOut = _this.isSidebarOut = false))
    );
  }


  /**
   * Observe sidebar hide analytics event, so we can resize the workspace/analytics area
   * @private
   */
  _observeSidebarEvents() {
    let _this = this;
    this.addDisposable(
      this.router
        .getEventObservable(WellKnownModelIds.sidebarModelId, 'hideAnalytics')
        .observe(() => _this.router.runAction(_this.modelId, () => _this.isAnalyticsOut = true))
    );
    this.addDisposable(
      this.router
        .getEventObservable(WellKnownModelIds.sidebarModelId, 'showAnalytics')
        .observe(() => _this.router.runAction(_this.modelId, () => _this.isAnalyticsOut = false))
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
