import React from 'react';
import { Router }from 'esp-js/src';
import { SpotTileModel } from './model';
import { PricingService, ExecutionService } from '../../services';
import { CurrencyPair } from '../../services/model';
import { RegionManager, RegionNames } from '../regions';
import { SchedulerService, } from '../../system';
import { OpenFin } from '../../system/openFin';

let modelIdKey = 1;

/**
 * Responsible for creating components for a spot tile.
 *
 * Note if you're using a container (for example <shamelessPlug>microdi-js</shamelessPlug>) you don't need factories.
 */
export default class SpotTileFactory {
  _router:Router;
  _pricingService:PricingService;
  _executionService:ExecutionService;
  _regionManager:RegionManager;
  _schedulerService:SchedulerService;
  _openFin:OpenFin;

  constructor(
    router:Router,
    pricingService:PricingService,
    executionService:ExecutionService,
    regionManager:RegionManager,
    schedulerService: SchedulerService,
    openFin: OpenFin
  ) {
    this._router = router;
    this._pricingService = pricingService;
    this._executionService = executionService;
    this._regionManager = regionManager;
    this._schedulerService = schedulerService;
    this._openFin = openFin;
  }

  createTileModel(currencyPair:CurrencyPair) {
    let spotTileModel = new SpotTileModel(
      this._createSpotTileModelId(),
      currencyPair,
      this._router,
      this._pricingService,
      this._executionService,
      this._regionManager,
      this._schedulerService,
      this._openFin
    );
    spotTileModel.observeEvents();
    return spotTileModel;
  }
  _createSpotTileModelId() {
    return `spotTile` + modelIdKey++;
  }
}
