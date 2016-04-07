import Rx from 'rx';
import _ from 'lodash';
import NVD3Chart from 'react-nvd3';
import d3 from 'd3';
import { Router,  observeEvent } from 'esp-js/src';
import { AnalyticsService } from '../../../services';
import { ServiceStatus } from '../../../system/service';
import { logger } from '../../../system';
import { ModelBase } from '../../common';
import { RegionManager, RegionNames, view  } from '../../regions';
import { PricePoint, PnlChartModel, PositionsChartModel, ChartModelBase } from './';
import {
  AnalyticsRequest,
  PositionUpdates,
  HistoricPosition,
  CurrencyPairPosition
} from '../../../services/model';
import { AnalyticsView } from '../views';

var _log:logger.Logger = logger.create('AnalyticsModel');

@view(AnalyticsView)
export default class AnalyticsModel extends ModelBase {
  _analyticsService:AnalyticsService;
  _regionManager:RegionManager;

  _positionsChartModel:PositionsChartModel;
  _pnlChartModel:PnlChartModel;

  isAnalyticsServiceConnected: Boolean;

  constructor(
    modelId:string,
    router:Router,
    analyticsService:AnalyticsService,
    regionManager:RegionManager
  ) {
    super(modelId, router);
    this._analyticsService = analyticsService;
    this._regionManager = regionManager;

    this.isAnalyticsServiceConnected = false;
    this._pnlChartModel = new PnlChartModel();
    this._positionsChartModel = new PositionsChartModel();
  }

  get positionsChartModel() {
    return this._positionsChartModel;
  }

  get pnlChartModel() {
    return this._pnlChartModel;
  }

  observeEvents() {
    super.observeEvents();
    this.addDisposable(this.router.observeEventsOn(this._modelId, this._positionsChartModel));
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Analytics model starting`);
    this._subscribeToConnectionStatus();
    this._regionManager.addToRegion(RegionNames.quickAccess, this);
  }

  @observeEvent('referenceDataLoaded')
  _onReferenceDataLoaded() {
    _log.info(`Ref data loaded, subscribing to analytics stream`);
    this._subscribeToAnalyticsStream();
  }

  @observeEvent('popOutAnalytics')
  _onPopOutAnalytics() {
    _log.info(`Popping out analytics`);
    this._regionManager.removeFromRegion(RegionNames.quickAccess, this);
    this._regionManager.addToRegion(
      RegionNames.popout,
      this,
      {
        onExternallyRemovedCallback: () => {
          // if the popout is closed, we add it back into the quickAccess region
          this._regionManager.addToRegion(RegionNames.quickAccess, this);
        },
        regionSettings: {
          width:400,
          height:500
        }
      }
    );
  }

  _subscribeToAnalyticsStream() {
    this._disposables.add(
      this._analyticsService.getAnalyticsStream(new AnalyticsRequest('USD')).subscribeWithRouter(
        this.router,
        this.modelId,
        (analyticsUpdate:PositionUpdates) => {
          this._pnlChartModel.update(analyticsUpdate.history);
          this._positionsChartModel.update(analyticsUpdate.currentPositions);
        },
        err => {
          _log.error('Error on analyticsService stream stream', err);
        }
      )
    );
  }

  _subscribeToConnectionStatus() {
    this.addDisposable(
      this._analyticsService.serviceStatusStream.subscribeWithRouter(
        this.router,
        this.modelId,
        (status:ServiceStatus) => {
          this.isAnalyticsServiceConnected = status.isConnected;
        })
    );
  }
}
