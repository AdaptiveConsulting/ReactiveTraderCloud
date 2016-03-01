import _ from 'lodash';
import { Router, model, observeEvent, DictionaryDisposable } from 'esp-js/src';
import { ReferenceDataService } from '../../../services';
import { CurrencyPairUpdates, CurrencyPairUpdate, UpdateType } from '../../../services/model';
import { logger } from '../../../system';
import { SpotTileFactory } from '../../spotTile';
import { ModelBase } from '../../common';

var _log:logger.Logger = logger.create('WorkspaceModel');

export default class WorkspaceModel extends ModelBase {
  _referenceDataService:ReferenceDataService;
  _spotTileFactory:SpotTileFactory;
  _spotTilesByCurrencyPair:DictionaryDisposable;
  _isInitialised:Boolean;

  constructor(router, referenceDataService:ReferenceDataService, spotTileFactory:SpotTileFactory) {
    super('workspaceModelId', router);
    this._referenceDataService = referenceDataService;
    this._spotTileFactory = spotTileFactory;
    this._spotTilesByCurrencyPair = new DictionaryDisposable();
    this.addDisposable(this._spotTilesByCurrencyPair);
    this._isInitialised = false;
  }

  @observeEvent('init')
  onInit() {
    let _this = this;
    if (!_this._isInitialised) {
      _this._isInitialised = true;
      _this.addDisposable(
        _this._referenceDataService.getCurrencyPairUpdatesStream().subscribe((referenceData:CurrencyPairUpdates) => {
          // In here we've received some async results.
          // We need to get back on the routers dispatch loop so we can modify our model (i.e. local state) allowing the router to dispatch state updates.
          // For more on the dispatch loop see http://esp.readthedocs.org/en/latest/router-api/dispatch-loop.html
          _this.router.runAction(_this.modelId, () => _this._processCurrencyPairUpdate(referenceData.currencyPairUpdates));
        })
      );
    }
  }

  _processCurrencyPairUpdate(currencyPairUpdates:Array<CurrencyPairUpdate>) {
    _log.debug(`Received [${currencyPairUpdates.length}] currency pairs.`);
    let _this = this;
    _.forEach(currencyPairUpdates, (currencyPairUpdate:CurrencyPairUpdate) => {
      let symbol = currencyPairUpdate.currencyPair.symbol;
      if (currencyPairUpdate.updateType === UpdateType.Added && !_this._spotTilesByCurrencyPair.containsKey(symbol)) {
        let spotTileModel = _this._spotTileFactory.createTileModel(currencyPairUpdate.currencyPair);
        _this._spotTilesByCurrencyPair.add(
          symbol,
          spotTileModel
        );
      } else if (currencyPairUpdate.updateType === UpdateType.Removed && _this._spotTilesByCurrencyPair.containsKey(symbol)) {
        let spotTileModel = _this._spotTilesByCurrencyPair[symbol];
        spotTileModel.dispose();
        _this._spotTilesByCurrencyPair.remove(symbol);
      }
    });
  }
}
