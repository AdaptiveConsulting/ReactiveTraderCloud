import _ from 'lodash';
import { DisposableBase } from 'esp-js';
import { UpdateType } from '../../services/model';
import logger from '../../system/logger';

var _log = logger.create('OpenfinPopoutService');

export default class SpotTileLoader extends DisposableBase{

  _router;
  _referenceDataService;
  _spotTileFactory;
  _spotTilesByCurrencyPairSymbol;

  constructor(router,
              referenceDataService,
              spotTileFactory) {
    super();
    this._router = router;
    this._referenceDataService = referenceDataService;
    this._spotTileFactory = spotTileFactory;
    this._spotTilesByCurrencyPairSymbol = {};
  }

  beginLoadTiles() {
    let _this = this;
    _this.addDisposable(
      _this._referenceDataService.getCurrencyPairUpdatesStream().subscribe(
        (referenceData) => {
          _this._processCurrencyPairUpdate(referenceData.currencyPairUpdates);
        },
        err => _log.error(`'error getting ccy pairs ${err}`, err)
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
  _processCurrencyPairUpdate(currencyPairUpdates) {
    _log.debug(`Received [${currencyPairUpdates.length}] currency pairs.`);
    let _this = this;

    _.forEach(currencyPairUpdates, (currencyPairUpdate) => {
      let currencyPairSymbol = currencyPairUpdate.currencyPair.symbol;
      if (currencyPairUpdate.updateType === UpdateType.Added && !_this._spotTilesByCurrencyPairSymbol.hasOwnProperty(currencyPairSymbol)) {
        let spotTileModel = _this._spotTileFactory.createTileModel(currencyPairUpdate.currencyPair);
        _this._spotTilesByCurrencyPairSymbol[currencyPairSymbol] = spotTileModel;
        _this._router.publishEvent(spotTileModel.modelId, 'init', {});
      } else if (currencyPairUpdate.updateType === UpdateType.Removed && _this._spotTilesByCurrencyPairSymbol.hasOwnProperty(currencyPairSymbol)) {
        let spotTileModel = _this._spotTilesByCurrencyPairSymbol[currencyPairSymbol];
        delete _this._spotTilesByCurrencyPairSymbol[currencyPairSymbol];
        _this._router.publishEvent(spotTileModel.modelId, 'tileClosed', {});
      }
    });
  }
}
