import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import { createHashHistory } from 'history';
import { WorkspaceModel } from './ui/workspace/model';
import { BlotterModel } from './ui/blotter/model';
import { AnalyticsModel } from './ui/analytics/model';
import { HeaderModel } from './ui/header/model';
import { ShellModel } from './ui/shell/model';
import { SpotTileFactory } from './ui/spotTile';
import { User, ServiceConst, ServiceStatusLookup } from './services/model';
import { SchedulerService, } from './system';
import { AutobahnConnectionProxy, Connection } from './system/service';
import { OpenFin } from './system/openFin';
import { default as espRouter } from './system/router';
import { PageContainer, ShellView } from './ui/shell/views';
import { SpotTileView } from './ui/spotTile/views';
import {
  AnalyticsService,
  BlotterService,
  ExecutionService,
  FakeUserRepository,
  PricingService,
  ReferenceDataService,
  CompositeStatusService
} from './services';

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
    let url = 'ws://' + location.hostname + ':8080/ws', realm = 'com.weareadaptive.reactivetrader';
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

    let shellModel = new ShellModel(espRouter, this._connection);
    shellModel.observeEvents();

    // wire-up the workspace
    let workspaceModel = new WorkspaceModel(
      espRouter,
      this._referenceDataService,
      new SpotTileFactory(espRouter, this._pricingService, this._executionService)
    );
    workspaceModel.observeEvents();

    // wire-up the blotter
    let blotterModel = new BlotterModel(espRouter, this._blotterService);
    blotterModel.observeEvents();

    // wire-up analytics
    let analyticsModel = new AnalyticsModel(espRouter, this._analyticsService);
    analyticsModel.observeEvents();

    // wire-up the header
    let headerModel = new HeaderModel(espRouter, this._compositeStatusService);
    headerModel.observeEvents();

    this._referenceDataService.hasLoadedStream.subscribe(() => {
      // Some models require the ref data to be loaded before they subscribe to their streams.
      // You could make all ref data access on top of an observable API, but in most instances this make it difficult to use.
      // Synchronous APIs for data that's effectively static make for much nicer code paths, the trade off is you need to bootstrap the loading
      // so the reference data cache is ready for consumption.
      // Note the ref service still exposes a push based api, it's just in most instances you don't want to use it.
      espRouter.broadcastEvent('referenceDataLoaded', {});
    });

    espRouter.publishEvent(shellModel.modelId, 'init', {});
    espRouter.publishEvent(workspaceModel.modelId, 'init', {});
    espRouter.publishEvent(blotterModel.modelId, 'init', {});
    espRouter.publishEvent(analyticsModel.modelId, 'init', {});
    espRouter.publishEvent(headerModel.modelId, 'init', {});
  }

  displayUi() {
    let history = createHashHistory({
      queryKey: false
    });
    let root = document.getElementById('root');
    let routes = (
      <Router history={history}>
        <Route path='/' component={PageContainer}>
          <IndexRoute component={ShellView}/>
        </Route>
        <Route path='/user' component={PageContainer}>
          <IndexRoute component={ShellView}/>
        </Route>
        <Route path='/tile'>
          <IndexRoute component={SpotTileView}/>
        </Route>
      </Router>
    );
    ReactDOM.render(routes, root);
  }
}

new Bootstrapper().run();
