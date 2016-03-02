import { Router, model, observeEvent } from 'esp-js/src';
import { ReferenceDataService } from '../../../services';
import { CurrencyPairUpdates } from '../../../services/model';
import { logger } from '../../../system';
import { CurrencyPair } from '../../../services/model';
import { ModelBase } from '../../common';

var _log:logger.Logger = logger.create('SpotTileModel');

let modelIdKey = 1;

export default class SpotTileModel extends ModelBase {
  _referenceDataService:ReferenceDataService;
  _currencyPair:CurrencyPair;

  constructor(
    currencyPair: CurrencyPair, // in a real system you'd take a specific state object, not just a piece of state as we do here
    router,
    referenceDataService:ReferenceDataService
  ) {
    super((`spotTileModel` + modelIdKey++), router);
    this._referenceDataService = referenceDataService;
    this._currencyPair = currencyPair;
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Cash tile starting for pair ${this._currencyPair.symbol}`);
  }

  @observeEvent('tileClosed')
  _onTileClosed() {
    _log.info(`Cash tile closing`);
  }
}
