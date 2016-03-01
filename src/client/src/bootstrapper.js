import { WorkspaceModel } from './ui/workspace/model';
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
    // create services
    let referenceDataService = serviceContainer.referenceDataService;

    // create shell model
    // create root ui with shell view
    // start shell model

    // create other models
    let spotTileFactory = new SpotTileFactory(router, referenceDataService);

    let workspaceModel = new WorkspaceModel(
      router,
      serviceContainer.referenceDataService,
      spotTileFactory
    );
    workspaceModel.observeEvents();

    // start other models
    router.publishEvent(workspaceModel.modelId, 'init', {});
  }
}
