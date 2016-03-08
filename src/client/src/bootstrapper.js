import { WorkspaceModel } from './ui/workspace/model';
import { BlotterModel } from './ui/blotter/model';
import { AnalyticsModel } from './ui/analytics/model';
import { HeaderModel } from './ui/header/model';
import { SpotTileFactory } from './ui/spotTile';
import {
  AnalyticsService,
  BlotterService,
  ExecutionService,
  FakeUserRepository,
  PricingService,
  ReferenceDataService,
  CompositeStatusService
} from './services';
import { User, ServiceConst, ServiceStatusLookup } from './services/model';
import { SchedulerService, AutobahnConnectionProxy, Connection } from './system';
import { OpenFin } from './system/openFin';
import { default as router } from './system/router';

export default class Bootstrapper {
  run() {

    let user:User = FakeUserRepository.currentUser;
    let url = 'ws://' + location.hostname + ':8080/ws', realm = 'com.weareadaptive.reactivetrader';
    let schedulerService = new SchedulerService();
    let autobahnProxy = new AutobahnConnectionProxy(url, realm);
    let connection = new Connection(user.code, autobahnProxy, schedulerService);

    let openFin = new OpenFin();
    let referenceDataService = new ReferenceDataService(ServiceConst.ReferenceServiceKey, connection, schedulerService);
    let pricingService = new PricingService(ServiceConst.PricingServiceKey, connection, schedulerService, referenceDataService);
    let blotterService = new BlotterService(ServiceConst.BlotterServiceKey, connection, schedulerService, referenceDataService);
    let executionService = new ExecutionService(ServiceConst.ExecutionServiceKey, connection, schedulerService, referenceDataService, openFin);
    let analyticsService = new AnalyticsService(ServiceConst.AnalyticsServiceKey, connection, schedulerService);
    let compositeStatusService = new CompositeStatusService(connection, pricingService, referenceDataService, blotterService, executionService, analyticsService);

    // create shell model
    // create root ui with shell view
    // start shell model

    // create other models
    let spotTileFactory = new SpotTileFactory(router, pricingService, executionService);

    // wire-up the workspace
    let workspaceModel = new WorkspaceModel(
      router,
      referenceDataService,
      spotTileFactory
    );
    workspaceModel.observeEvents();

    // wire-up the blotter
    let blotterModel = new BlotterModel(
      router,
      blotterService
    );
    blotterModel.observeEvents();

    // wire-up analytics
    let analyticsModel = new AnalyticsModel(
      router,
      analyticsService
    );
    analyticsModel.observeEvents();

    // wire-up the header
    let headerModel = new HeaderModel(
      router,
      compositeStatusService
    );
    headerModel.observeEvents();

    // Bring up ref data first.
    // The ref data API allows for both synchronous and asynchronous data access however in most cases you'll be using the synchronous API.
    // Given this we wait for it to build it's cache now.
    // Note there are lots of bells and whistles you can put around this, for example spin up the models, but wait for them to receive a ref data loaded event, etc.
    // Such functionality give a better load experience, for now we'll just wait.
    referenceDataService.hasLoadedStream.subscribe(() => {

      // start other models
      router.publishEvent(workspaceModel.modelId, 'init', {});
      router.publishEvent(blotterModel.modelId, 'init', {});
      router.publishEvent(analyticsModel.modelId, 'init', {});
      router.publishEvent(headerModel.modelId, 'init', {});
    });
    referenceDataService.load();
  }
}
