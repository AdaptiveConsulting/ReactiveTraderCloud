import React from 'react';
import ReactDOM from 'react-dom';
import { BlotterModel } from './ui/blotter/model';
import { AnalyticsModel } from './ui/analytics/model';
import { HeaderModel } from './ui/header/model';
import { FooterModel } from './ui/footer/model';
import { ShellModel } from './ui/shell/model';
import { SpotTileFactory, SpotTileLoader } from './ui/spotTile';
import { User, ServiceConst, ServiceStatusLookup } from './services/model';
import { SchedulerService, } from './system';
import { AutobahnConnectionProxy, Connection } from './system/service';
import { OpenFin } from './system/openFin';
import { default as espRouter } from './system/router';
import { ShellView } from './ui/shell/views';
import { SpotTileView } from './ui/spotTile/views';
import { RegionModel, SingleItemRegionModel } from './ui/regions/model';
import { RegionManager, RegionNames } from './ui/regions';
import config from 'config.json';

import {
  AnalyticsService,
  BlotterService,
  ExecutionService,
  FakeUserRepository,
  PricingService,
  ReferenceDataService,
  CompositeStatusService
} from './services';
import { WellKnownModelIds } from './';

class Bootstrapper {
  _connection:Connection;
  _referenceDataService:ReferenceDataService;
  _pricingService:PricingService;
  _blotterService:BlotterService;
  _executionService:ExecutionService;
  _analyticsService:AnalyticsService;
  _compositeStatusService:CompositeStatusService;
  _schedulerService:SchedulerService;

  run() {
    this.startServices();
    this.startModels();
    this.displayUi();
  }

  startServices() {
    let user:User = FakeUserRepository.currentUser;
    let serverEndPointUrl = config.overwriteServerEndpoint ? config.serverEndPointUrl : location.hostname;
    let url = 'ws://' + serverEndPointUrl + ':8080/ws', realm = 'com.weareadaptive.reactivetrader';
    this._schedulerService = new SchedulerService();
    this._connection = new Connection(
      user.code,
      new AutobahnConnectionProxy(url, realm),
      this._schedulerService
    );

    // in a larger app you'd put a container in here (shameless plug: https://github.com/KeithWoods/microdi-js, but there are many offerings in this space).
    this._openFin = new OpenFin();
    this._referenceDataService = new ReferenceDataService(ServiceConst.ReferenceServiceKey, this._connection, this._schedulerService);
    this._pricingService = new PricingService(ServiceConst.PricingServiceKey, this._connection, this._schedulerService, this._referenceDataService);
    this._blotterService = new BlotterService(ServiceConst.BlotterServiceKey, this._connection, this._schedulerService, this._referenceDataService);
    this._executionService = new ExecutionService(ServiceConst.ExecutionServiceKey, this._connection, this._schedulerService, this._referenceDataService, this._openFin);
    this._analyticsService = new AnalyticsService(ServiceConst.AnalyticsServiceKey, this._connection, this._schedulerService);
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

  startModels() {

    // Wire up the region management infrastructure:
    // This infrastructure allows for differing views to be put into the shell without the shell having to be coupled to all these views.
    let workspaceRegionModel = new RegionModel(WellKnownModelIds.workspaceRegionModelId, RegionNames.workspace, espRouter);
    workspaceRegionModel.observeEvents();
    let popoutRegionModel = new RegionModel(WellKnownModelIds.popoutRegionModelId, RegionNames.popout, espRouter);
    popoutRegionModel.observeEvents();
    let blotterRegionModel = new SingleItemRegionModel(WellKnownModelIds.blotterRegionModelId, RegionNames.blotter, espRouter);
    blotterRegionModel.observeEvents();
    let quickAccessRegionModel = new SingleItemRegionModel(WellKnownModelIds.quickAccessRegionModelId, RegionNames.quickAccess, espRouter);
    quickAccessRegionModel.observeEvents();
    let regionManager = new RegionManager([workspaceRegionModel, popoutRegionModel, blotterRegionModel, quickAccessRegionModel]);

    // wire up the shell
    let shellModel = new ShellModel(WellKnownModelIds.shellModelId, espRouter, this._connection);
    shellModel.observeEvents();

    // wire-up the loader that populats the workspace with spot tiles.
    // In a more suffocated app you'd have some 'add product' functionality allowing the users to add workspace views/products manually.
    let spotTileLoader = new SpotTileLoader(
      espRouter,
      this._referenceDataService,
      new SpotTileFactory(espRouter, this._pricingService, this._executionService, regionManager)
    );
    spotTileLoader.beginLoadTiles();

    // wire-up the blotter
    let blotterModel = new BlotterModel(WellKnownModelIds.blotterModelId, espRouter, this._blotterService, regionManager);
    blotterModel.observeEvents();

    // wire-up analytics
    let analyticsModel = new AnalyticsModel(WellKnownModelIds.analyticsModelId, espRouter, this._analyticsService, regionManager);
    analyticsModel.observeEvents();

    // wire-up the header
    let headerModel = new HeaderModel(WellKnownModelIds.headerModelId, espRouter);
    headerModel.observeEvents();

    // wire-up the footer
    let footerModel = new FooterModel(WellKnownModelIds.footerModelId, espRouter, this._compositeStatusService);
    footerModel.observeEvents();

    this._referenceDataService.hasLoadedStream.subscribe(() => {
      // Some models require the ref data to be loaded before they subscribe to their streams.
      // You could make all ref data access on top of an observable API, but in most instances this make it difficult to use.
      // Synchronous APIs for data that's effectively static make for much nicer code paths, the trade off is you need to bootstrap the loading
      // so the reference data cache is ready for consumption.
      // Note the ref service still exposes a push based api, it's just in most instances you don't want to use it.
      espRouter.broadcastEvent('referenceDataLoaded', {});
    });

    espRouter.broadcastEvent('init', {});
  }

  displayUi() {
    ReactDOM.render(
      <ShellView />,
      document.getElementById('root')
    );
  }
}

let runBootstrapper = location.pathname === '/' && location.hash.length === 0;
// if we're not the root we (perhaps a popup) we never re-run the bootstrap logic
if(runBootstrapper) {
  new Bootstrapper().run();
}
