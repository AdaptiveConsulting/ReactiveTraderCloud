import React from 'react';
import { Router }from 'esp-js/src';
import { SpotTileModel } from './model';
import { PricingService, ExecutionService } from '../../services';
import { CurrencyPair } from '../../services/model';
import { RegionManager, RegionNames } from '../regions';

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

  constructor(
    router:Router,
    pricingService:PricingService,
    executionService:ExecutionService,
    regionManager:RegionManager
  ) {
    this._router = router;
    this._pricingService = pricingService;
    this._executionService =executionService;
    this._regionManager = regionManager;
  }

  createTileModel(currencyPair:CurrencyPair) {
    let spotTileModel = new SpotTileModel(
      this._createSpotTileModelId(),
      currencyPair,
      this._router,
      this._pricingService,
      this._executionService,
      this._regionManager
    );
    spotTileModel.observeEvents();
    return spotTileModel;
  }
  _createSpotTileModelId() {
    return `spotTile` + modelIdKey++;
  }
}
