import { Router } from 'esp/src';
import { ReferenceDataService } from '../../services';
import { CurrencyPairUpdates, CurrencyPairUpdate, UpdateType } from '../../services/model';
import { SpotTileFactory } from './';
import { SpotTileModel } from './model';

export default class TileLoader {

  _router:Router;
  _referenceDataService:ReferenceDataService;
  _spotTileFactory:SpotTileFactory;
  _spotTilesByCurrencyPairSymbol:{ [modelId: string] : SpotTileModel };

  constructor(router:Router,
              referenceDataService:ReferenceDataService,
              spotTileFactory:SpotTileFactory) {
    this._router = router;
    this._referenceDataService = referenceDataService;
    this._spotTileFactory = spotTileFactory;
    this._spotTilesByCurrencyPairSymbol = {};
  }

  loadTiles() {
    this.addDisposable(
      this._referenceDataService.getCurrencyPairUpdatesStream().subscribeWithRouter(
        this.router,
        this.modelId,
        (referenceData:CurrencyPairUpdates) => {
          this._processCurrencyPairUpdate(referenceData.currencyPairUpdates);
        }
      )
    );
  }

  /**
   * Creates spot tiles for each currencyPair
   *
   * It's not really a normal use case to load spot tiles in a trading app based on static data for pairs.
   * In a real app this component wouldn't know much of the children it hosts, it would just get told to display something.
   * For this demo it seems sensible as all the workspace hosts is spot tiles.
   */
  _processCurrencyPairUpdate(currencyPairUpdates:Array<CurrencyPairUpdate>) {
    _log.debug(`Received [${currencyPairUpdates.length}] currency pairs.`);
    let _this = this;

    _.forEach(currencyPairUpdates, (currencyPairUpdate:CurrencyPairUpdate) => {
      let currencyPairSymbol = currencyPairUpdate.currencyPair.symbol;
      if (currencyPairUpdate.updateType === UpdateType.Added && !_this._spotTilesByCurrencyPairSymbol.hasOwnProperty(currencyPairSymbol)) {
        let spotTileModel = _this._spotTileFactory.createTileModel(currencyPairUpdate.currencyPair);
        _this._spotTilesByCurrencyPairSymbol[currencyPairSymbol] = spotTileModel;
        _this.router.publishEvent(spotTileModel.modelId, 'init', {});
      } else if (currencyPairUpdate.updateType === UpdateType.Removed && _this._spotTilesByCurrencyPairSymbol.hasOwnProperty(currencyPairSymbol)) {
        let spotTileModel = _this._spotTilesByCurrencyPairSymbol[currencyPairSymbol];
        delete _this._spotTilesByCurrencyPairSymbol[currencyPairSymbol];
        _this.router.publishEvent(spotTileModel.modelId, 'tileClosed', {});
      }
    });
  }
}
