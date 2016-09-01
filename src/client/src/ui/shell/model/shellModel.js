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
  isBlotterOut:boolean;
  isAnalyticsOut:boolean;
  wellKnownModelIds:WellKnownModelIds;
  showSideBar:boolean;

  _blotterRegionModel:SingleItemRegionModel;
  _analyticsRegionModel:SingleItemRegionModel;

  constructor(
    modelId:string,
    router:Router,
    connection:Connection,
    blotterRegionModel:SingleItemRegionModel,
    analyticsRegionModel:SingleItemRegionModel
  ) {
    super(modelId, router);
    this._connection = connection;
    this.sessionExpired = false;
    this.showSideBar = true;
    this.wellKnownModelIds = WellKnownModelIds;
    this.appVersion = `v${__VERSION__}`;

    this._blotterRegionModel = blotterRegionModel;
    this._analyticsRegionModel = analyticsRegionModel;
  }

  @observeEvent('init')
  _onInit() {
    _log.info('Shell model starting');
    this._observeForSessionExpired();
    this._observeForBlotterTearOut();
    this._observeForAnalyticsTearOut();
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
    this.addDisposable(
      this._blotterRegionModel.hasContentSubject.streamFor(this.modelId).subscribe(hasContent => {
        this.isBlotterOut = !hasContent;
      })
    );
  }

  /**
   * Observe blotter tear out events, so we can resize the workspace/analytics area
   * @private
   */
  _observeForAnalyticsTearOut() {
    this.addDisposable(
      this._analyticsRegionModel.hasContentSubject.streamFor(this.modelId).subscribe(hasContent => {
        this.isAnalyticsOut = !hasContent;
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
