import { WorkspaceModel } from './ui/workspace/model';
import { BlotterModel } from './ui/blotter/model';
import { AnalyticsModel } from './ui/analytics/model';
import { SpotTileFactory } from './ui/spotTile';
import {
  AnalyticsService,
  BlotterService,
  ExecutionService,
  FakeUserRepository,
  PricingService,
  ReferenceDataService,
// TODO delete serviceContainer and do all wire-up here
  serviceContainer
} from './services';

import { default as router } from './system/router';

export default class Bootstrapper {
  run() {
    // create services // TODO delete serviceContainer and create all service here
    let referenceDataService = serviceContainer.referenceDataService;
    let pricingService = serviceContainer.pricingService;
    let executionService = serviceContainer.executionService;
    let blotterService = serviceContainer.blotterService;
    let analyticsService = serviceContainer.analyticsService;

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
    });
    referenceDataService.load();
  }
}
