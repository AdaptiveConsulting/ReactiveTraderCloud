import { Router,  observeEvent, RouterSubject } from 'esp-js';
import { viewBinding } from 'esp-js-react';
import { AnalyticsService } from '../../../services';
import { ServiceStatus } from '../../../system/service';
import { logger, Environment } from '../../../system';
import { ModelBase, RegionManagerHelper } from '../../common';
import { RegionManager, RegionNames, } from '../../regions';
import { PnlChartModel, PositionsChartModel, ChartModelBase } from './';
import {
  AnalyticsRequest,
  PositionUpdates,
  RegionSettings
} from '../../../services/model';
import AnalyticsView from '../views/analyticsView.jsx';
import { OpenFin } from '../../../system/openFin';

var _log:logger.Logger = logger.create('AnalyticsModel');

@viewBinding(AnalyticsView)
export default class AnalyticsModel extends ModelBase {
  _analyticsService:AnalyticsService;
  _positionsChartModel:PositionsChartModel;
  _pnlChartModel:PnlChartModel;
  _regionManagerHelper:RegionManagerHelper;
  _regionManager:RegionManager;
  _regionSettings:RegionSettings;
  _regionName:string;
  _openFin:OpenFin;

  isAnalyticsServiceConnected: Boolean;

  constructor(
    modelId:string,
    router:Router,
    analyticsService:AnalyticsService,
    regionManager:RegionManager,
    openFin:OpenFin
  ) {
    super(modelId, router);
    this._analyticsService = analyticsService;
    this._regionName = RegionNames.sidebar;
    this.isAnalyticsServiceConnected = false;
    this._regionSettings = new RegionSettings(RegionNames.sidebar, 400, 800, false);
    this._pnlChartModel = new PnlChartModel();
    this._positionsChartModel = new PositionsChartModel();
    this._regionManager = regionManager;
    this._regionManagerHelper = new RegionManagerHelper(this._regionName, regionManager, this, this._regionSettings);
    this._openFin = openFin;
  }

  get positionsChartModel() {
    return this._positionsChartModel;
  }

  get pnlChartModel() {
    return this._pnlChartModel;
  }

  get canPopout() {
    return Environment.isRunningInIE;
  }

  observeEvents() {
    super.observeEvents();
    this.addDisposable(this.router.observeEventsOn(this._modelId, this._positionsChartModel));
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Analytics model starting`);
    this._subscribeToConnectionStatus();
    this._regionManagerHelper.init();
  }

  @observeEvent('referenceDataLoaded')
  _onReferenceDataLoaded() {
    _log.info(`Ref data loaded, subscribing to analytics stream`);
    this._subscribeToAnalyticsStream();
  }

  @observeEvent('popOutAnalytics')
  _onPopOutAnalytics() {
    _log.info(`Popping out analytics`);
    this._regionManagerHelper.popout();
  }

  _subscribeToAnalyticsStream() {
    this._disposables.add(
      this._analyticsService.getAnalyticsStream(new AnalyticsRequest('USD')).subscribeWithRouter(
        this.router,
        this.modelId,
        (analyticsUpdate:PositionUpdates) => {
          this._pnlChartModel.update(analyticsUpdate.history);
          this._positionsChartModel.update(analyticsUpdate.currentPositions);
          this._openFin.publishCurrentPositions(analyticsUpdate.currentPositions);
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
