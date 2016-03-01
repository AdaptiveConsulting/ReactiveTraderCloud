import { Router }from 'esp-js/src';
import { SpotTileModel } from './model';
import { ReferenceDataService } from '../../services';
import { CurrencyPair } from '../../services/model';

export default class SpotTileFactory {
  _router:Router;
  _referenceDataService:ReferenceDataService;

  constructor(router:Router, referenceDataService:ReferenceDataService) {
    this.router = router;
    this._referenceDataService = referenceDataService;
  }

  createTileModel(currencyPair:CurrencyPair) {
    let spotTileModel = new SpotTileModel(currencyPair, this.router, this._referenceDataService);
    spotTileModel.observeEvents();
    this.router.publishEvent(spotTileModel.modelId, 'init', {});
    return spotTileModel;
  }
}
