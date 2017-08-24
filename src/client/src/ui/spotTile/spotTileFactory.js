import React from 'react';
import { Router }from 'esp-js';
import { SpotTileModel } from './model';
import { PricingService, ExecutionService } from '../../services';
import { CurrencyPair } from '../../services/model';
import { RegionManager, RegionNames } from '../regions';
import { SchedulerService, } from '../../system';
import { OpenFin } from '../../system/openFin';

/**
 * Responsible for creating components for a spot tile.
 *
 * Note if you're using a container (for example <shamelessPlug>microdi-js</shamelessPlug>) you don't need factories.
 */
export default class SpotTileFactory {
  _router;
  _pricingService;
  _executionService;
  _regionManager;
  _schedulerService;
  _openFin;

  constructor(
    router,
    pricingService,
    executionService,
    regionManager,
    schedulerService,
    openFin
  ) {
    this._router = router;
    this._pricingService = pricingService;
    this._executionService = executionService;
    this._regionManager = regionManager;
    this._schedulerService = schedulerService;
    this._openFin = openFin;
  }

  createTileModel(currencyPair) {
    let spotTileModel = new SpotTileModel(
      this._createSpotTileModelId(currencyPair.symbol),
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
  _createSpotTileModelId(currencyPair) {
    return `spotTile-${currencyPair}`;
  }
}
