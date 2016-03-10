import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import { createHashHistory } from 'history';
import { WorkspaceModel } from './components/workspace/model';
import { BlotterModel } from './components/blotter/model';
import { AnalyticsModel } from './components/analytics/model';
import { HeaderModel } from './components/header/model';
import { ShellModel } from './components/shell/model';
import { SpotTileFactory } from './components/spotTile';
import { User, ServiceConst } from './services/model';
import { SchedulerService, } from './system';
import { AutobahnConnectionProxy, Connection } from './system/service';
import { OpenFin } from './system/openFin';
import { default as espRouter } from './system/router';
import { PageContainer, ShellView } from './components/shell/views';
import { SpotTileView } from './components/spotTile/views';
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

    this._openFin = new OpenFin();
    this._referenceDataService = new ReferenceDataService(ServiceConst.ReferenceServiceKey, this._connection, this._schedulerService);
    this._pricingService = new PricingService(ServiceConst.PricingServiceKey, this._connection, this._schedulerService, this._referenceDataService);
    this._blotterService = new BlotterService(ServiceConst.BlotterServiceKey, this._connection, this._schedulerService, this._referenceDataService);
    this._executionService = new ExecutionService(ServiceConst.ExecutionServiceKey, this._connection, this._schedulerService, this._referenceDataService, this._openFin);
    this._analyticsService = new AnalyticsService(ServiceConst.AnalyticsServiceKey, this._connection, this._schedulerService);
    this._compositeStatusService = new CompositeStatusService(this._connection, this._pricingService, this._referenceDataService, this._blotterService, this._executionService, this._analyticsService);

    // create shell model
    // create root ui with shell view
    // start shell model

    // bring up all the services
    this._pricingService.connect();
    this._blotterService.connect();
    this._executionService.connect();
    this._analyticsService.connect();
    this._compositeStatusService.start();
    this._referenceDataService.connect();
    this._referenceDataService.load();
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

    // Bring up ref data first and wait for it to load.
    // The ref data API allows for both synchronous and asynchronous data access however in most cases you'll be using the synchronous API.
    // Given this we wait for it to build it's cache now.
    // Note there are lots of bells and whistles you can put around this, for example spin up the models, but wait for them to receive a ref data loaded event, etc.
    // Such functionality give a better load experience, for now we'll just wait.
    this._referenceDataService.hasLoadedStream.subscribe(() => {
      // start other models by kicking off an initial event

      //       espRouter.broadcastEvent('init', {});

      espRouter.publishEvent(shellModel.modelId, 'init', {});
      espRouter.publishEvent(workspaceModel.modelId, 'init', {});
      espRouter.publishEvent(blotterModel.modelId, 'init', {});
      espRouter.publishEvent(analyticsModel.modelId, 'init', {});
      espRouter.publishEvent(headerModel.modelId, 'init', {});
    });
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
