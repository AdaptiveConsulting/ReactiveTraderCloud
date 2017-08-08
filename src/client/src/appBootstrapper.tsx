import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Router } from 'esp-js';
import { RouterProvider, SmartComponent } from 'esp-js-react/dist/esp-react';
import { BlotterModel } from './ui/blotter/model';
import { AnalyticsModel } from './ui/analytics/model';
import { FooterModel } from './ui/footer/model';
import { ShellModel } from './ui/shell/model';
import { ChromeModel } from './ui/common/components/chrome/model';
import { SpotTileFactory, SpotTileLoader } from './ui/spotTile';
import { ServiceConst } from './services/model';
import SchedulerService from './system/schedulerService';
import { AutobahnConnectionProxy, Connection } from './system/service';
import { OpenFin } from './system/openFin';
import { PopoutRegionModel, RegionModel, SingleItemRegionModel } from './ui/regions/model';
import { RegionManager, RegionNames } from './ui/regions';
import * as config from 'config.json';

import {
  AnalyticsService,
  BlotterService,
  CompositeStatusService,
  ExecutionService,
  FakeUserRepository,
  PricingService,
  ReferenceDataService
} from './services';
import { WellKnownModelIds } from './';
import logger from './system/logger';
import User from './services/model/user';
import configureStore from './redux/configureStore'

var _log = logger.create('OpenfinPopoutService');


// When the application is run in openfin then 'fin' will be registered on the global window object.
declare const window: any;

class AppBootstrapper {
  _connection: Connection;
  _referenceDataService: ReferenceDataService;
  _pricingService: PricingService;
  _blotterService: BlotterService;
  _executionService: ExecutionService;
  _analyticsService: AnalyticsService;
  _compositeStatusService: CompositeStatusService;
  _schedulerService: SchedulerService;
  _openFin: any;

  get endpointURL() {
    return config.overwriteServerEndpoint ? config.serverEndPointUrl : location.hostname;
  }

  run() {
    let espRouter = this.createRouter();
    this.startServices(espRouter);
    configureStore(this._referenceDataService, this._blotterService, this._pricingService, this._analyticsService, this._compositeStatusService);
    this.startModels(espRouter);
    this.displayUi(espRouter);
  }

  createRouter() {
    let espRouter = new Router();
    espRouter.addOnErrorHandler(err => {
      _log.error('Unhandled error in model', err);
    });
    return espRouter;
  }

  startServices(espRouter) {
    const user: User = FakeUserRepository.currentUser;
    const realm = 'com.weareadaptive.reactivetrader';
    const url = this.endpointURL;

    this._schedulerService = new SchedulerService();
    this._connection = new Connection(
      user.code,
      new AutobahnConnectionProxy(url, realm),
      this._schedulerService
    );

    // in a larger app you'd put a container in here (shameless plug: https://github.com/KeithWoods/microdi-js, but there are many offerings in this space).
    this._openFin = new OpenFin(espRouter);
    this._referenceDataService = new ReferenceDataService(ServiceConst.ReferenceServiceKey, this._connection, this._schedulerService);
    this._pricingService = new PricingService(ServiceConst.PricingServiceKey, this._connection, this._schedulerService, this._referenceDataService);
    this._blotterService = new BlotterService(ServiceConst.BlotterServiceKey, this._connection, this._schedulerService, this._referenceDataService);
    this._executionService = new ExecutionService(ServiceConst.ExecutionServiceKey, this._connection, this._schedulerService, this._referenceDataService, this._openFin);
    this._analyticsService = new AnalyticsService(ServiceConst.AnalyticsServiceKey, this._connection, this._schedulerService, this._referenceDataService);
    this._compositeStatusService = new CompositeStatusService(this._connection, this._pricingService, this._referenceDataService, this._blotterService, this._executionService, this._analyticsService);

    // connect/load all the services
    this._pricingService.connect();
    this._blotterService.connect();
    this._executionService.connect();
    this._analyticsService.connect();
    this._compositeStatusService.start();
    this._referenceDataService.connect();
    this._referenceDataService.load();
    // and finally the underlying connection
    this._connection.connect();
  }

  startModels(espRouter) {

    // Wire up the region management infrastructure:
    // This infrastructure allows for differing views to be put into the shell without the shell having to be coupled to all these views.
    let workspaceRegionModel = new RegionModel(WellKnownModelIds.workspaceRegionModelId, RegionNames.workspace, espRouter);
    workspaceRegionModel.observeEvents();
    let popoutRegionModel = new PopoutRegionModel(WellKnownModelIds.popoutRegionModelId, RegionNames.popout, espRouter, this._openFin);
    popoutRegionModel.observeEvents();
    let blotterRegionModel = new SingleItemRegionModel(WellKnownModelIds.blotterRegionModelId, RegionNames.blotter, espRouter);
    blotterRegionModel.observeEvents();
    let sidebarRegionModel = new SingleItemRegionModel(WellKnownModelIds.sidebarRegionModelId, RegionNames.sidebar, espRouter);
    sidebarRegionModel.observeEvents();
    let allRegionModels = [workspaceRegionModel, popoutRegionModel, blotterRegionModel, sidebarRegionModel];
    let regionManager = new RegionManager(allRegionModels, this._openFin.isRunningInOpenFin);

    // wire up the application chrome
    let chromeModel = new ChromeModel(WellKnownModelIds.chromeModelId, espRouter, this._openFin);
    chromeModel.observeEvents();

    // wire-up the loader that populates the workspace with spot tiles.
    // In a more sophisticated app you'd have some 'add product' functionality allowing the users to add workspace views/products manually.
    let spotTileLoader = new SpotTileLoader(
      espRouter,
      this._referenceDataService,
      new SpotTileFactory(espRouter, this._pricingService, this._executionService, regionManager, this._schedulerService, this._openFin)
    );
    spotTileLoader.beginLoadTiles();

    // wire-up the blotter
    let blotterModel = new BlotterModel(WellKnownModelIds.blotterModelId, espRouter, this._blotterService, regionManager, this._openFin, this._schedulerService);
    blotterModel.observeEvents();

    // wire-up analytics
    let analyticsModel = new AnalyticsModel(WellKnownModelIds.analyticsModelId, espRouter, this._analyticsService, regionManager, this._openFin);
    analyticsModel.observeEvents();

    // wire-up the footer
    let footerModel = new FooterModel(WellKnownModelIds.footerModelId, espRouter, this._compositeStatusService, this._openFin);
    footerModel.observeEvents();

    // wire up the apps main shell
    let shellModel = new ShellModel(
      WellKnownModelIds.shellModelId,
      espRouter,
      this._connection,
      blotterRegionModel,
      sidebarRegionModel
    );
    shellModel.observeEvents();

    this._referenceDataService.hasLoadedStream.subscribe(() => {
      // Some models require the ref data to be loaded before they subscribe to their streams.
      // You could make all ref data access on top of an observable API, but in most instances this make it difficult to use.
      // Synchronous APIs for data that's effectively static make for much nicer code paths, the trade off is you need to bootstrap the loading
      // so the reference data cache is ready for consumption.
      // Note the ref service still exposes a push based api, it's just in most instances you don't want to use it.
      espRouter.broadcastEvent('referenceDataLoaded', {});
    });

    if (this._openFin.isRunningInOpenFin) {
      window.fin.desktop.main(() => espRouter.broadcastEvent('init', {}));
    } else {
      espRouter.broadcastEvent('init', {});
    }
  }

  displayUi(espRouter) {
    ReactDOM.render(
      <RouterProvider router={espRouter}>
        <SmartComponent modelId={WellKnownModelIds.shellModelId} />
      </RouterProvider>,
      document.getElementById('root')
    );
  }
}

let runBootstrapper = location.pathname === '/' && location.hash.length === 0;
// if we're not the root we (perhaps a popup) we never re-run the bootstrap logic
if (runBootstrapper) {
  new AppBootstrapper().run();
}
