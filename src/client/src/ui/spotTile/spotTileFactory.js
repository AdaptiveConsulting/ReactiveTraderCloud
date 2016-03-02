import React from 'react';
import { Router }from 'esp-js/src';
import { SpotTileModel } from './model';
import { ReferenceDataService, PricingService, ExecutionService } from '../../services';
import { CurrencyPair } from '../../services/model';
import { SpotTileView } from './views';

/**
 * Responsible for creating components for a spot tile.
 *
 * Note if you're using a container (for example <shamelessPlug>microdi-js</shamelessPlug>) you don't need factories.
 */
export default class SpotTileFactory {
  _router:Router;
  _referenceDataService:ReferenceDataService;
  _pricingService:PricingService;
  _executionService:ExecutionService;

  constructor(
    router:Router,
    referenceDataService:ReferenceDataService,
    pricingService:PricingService,
    executionService:ExecutionService
  ) {
    this._router = router;
    this._referenceDataService = referenceDataService;
    this._pricingService = pricingService;
    this._executionService =executionService;
  }

  createTileModel(currencyPair:CurrencyPair) {
    let spotTileModel = new SpotTileModel(currencyPair, this._router, this._referenceDataService, this._pricingService, this._executionService);
    spotTileModel.observeEvents();
    this._router.publishEvent(spotTileModel.modelId, 'init', {});
    return spotTileModel;
  }

  createTileView(modelId) {
    return React.createElement(SpotTileView, { modelId: modelId });
  }
}
