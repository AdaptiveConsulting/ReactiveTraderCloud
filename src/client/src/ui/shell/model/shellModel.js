import { Router, observeEvent } from 'esp-js';
import { viewBinding } from 'esp-js-react';
import { logger } from '../../../system';
import { Connection } from '../../../system/service';
import { ConnectionStatus } from '../../../system/service';
import { ModelBase } from '../../common';
import { WellKnownModelIds } from '../../../';
import ShellView from '../views/shellView';
import BlotterModel from '../../blotter/model/blotterModel';
import AnalyticsModel from '../../analytics/model/analyticsModel';
import SidebarModel from '../../sidebar/model/sidebarModel';

var _log:logger.Logger = logger.create('ShellModel');

@viewBinding(ShellView)
export default class ShellModel extends ModelBase {
  _connection:Connection;
  sessionExpired:boolean;
  isBlotterOut:boolean;
  isAnalyticsOut:boolean;
  isSidebarOut:boolean;
  wellKnownModelIds:WellKnownModelIds;
  showSideBar:boolean;

  _blotter:BlotterModel;
  _analyticsModel:AnalyticsModel;
  _sidebarModel:SidebarModel;

  constructor(
    modelId:string,
    router:Router,
    connection:Connection,
    blotter:BlotterModel,
    analyticsModel:AnalyticsModel,
    sidebarModel:SidebarModel
  ) {
    super(modelId, router);
    this._connection = connection;
    this.sessionExpired = false;
    this.showSideBar = true;
    this.wellKnownModelIds = WellKnownModelIds;
    this.appVersion = `v${__VERSION__}`;

    this._blotter = blotter;
    this._analyticsModel = analyticsModel;
    this._sidebarModel = sidebarModel;
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
        .subscribe(() => _this.router.runAction(_this.modelId, () => _this.isBlotterOut = true))
    );
    this.addDisposable(
      this.router
        .getEventObservable(WellKnownModelIds.popoutRegionModelId, 'removeFromRegion')
        .where(({model}) => model.modelId === WellKnownModelIds.blotterModelId)
        .subscribe(() => _this.router.runAction(_this.modelId, () => _this.isBlotterOut = false))
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
        .subscribe(() => _this.router.runAction(_this.modelId, () => _this.isAnalyticsOut = _this.isSidebarOut = true))
    );
    this.addDisposable(
      this.router
        .getEventObservable(WellKnownModelIds.popoutRegionModelId, 'removeFromRegion')
        .where(({model}) => model.modelId === WellKnownModelIds.analyticsModelId)
        .subscribe(() => _this.router.runAction(_this.modelId, () => _this.isAnalyticsOut = _this.isSidebarOut = false))
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
        .subscribe(() => _this.router.runAction(_this.modelId, () => _this.isAnalyticsOut = true))
    );
    this.addDisposable(
      this.router
        .getEventObservable(WellKnownModelIds.sidebarModelId, 'showAnalytics')
        .subscribe(() => _this.router.runAction(_this.modelId, () => _this.isAnalyticsOut = false))
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
